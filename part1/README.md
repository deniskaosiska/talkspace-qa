# Part 1 — Request Lifecycle Test Plan

**Assignment:** Talkspace Senior Full Stack QA Engineer take-home (Part 1, ~40 min written)

## Files

| File | Purpose |
|------|---------|
| `Part1_Request_Lifecycle_RBT_Test_Plan.xlsx` | **Submit this** — execution workbook (source of truth) |
| `Part1_Request_Lifecycle_RBT_Test_Plan.md` | Markdown companion (earlier draft) |

## Quick start for reviewers

1. Open **Submission Notes** — assumptions, ambiguities, feature feedback
2. Open **Test Cases** — 25 RBT cases grouped by action; filter `Regression?=Yes` for the 6-case smoke pack
3. Open **Release Metrics** — post-release monitoring blueprint (metrics, logs, alerts, release gate)

## Scope covered

- UI / API create → `pending`
- External ~2 min status update (approved / denied / stay pending)
- 5s scheduled job: approval email + 30m expiry
- Client + internal APIs, DB (`REQUESTS`, `AUDIT_LOGS`, `CRON_TASK_HISTORY`), app logs

---

## Test case list (25)

Full steps, preconditions, and execution columns live in the **Test Cases** sheet. Below is the index the assignment asks for in the submission body.

**Regression smoke (6)** — filter `Regression?=Yes` in Excel:

| ID | Priority | Title |
|----|----------|-------|
| R-SMOKE-01 | P0 | Create request → pending (happy path) |
| R-SMOKE-02 | P0 | Approve → job → emailed once (no duplicates) |
| R-SMOKE-03 | P0 | Aged pending → expired, not emailed |
| R-SMOKE-04 | P0 | Non-approved statuses → no email |
| R-SMOKE-05 | P0 | GET request details match DB (after transitions) |
| R-SMOKE-06 | P0 | Cron history row on successful run |

### 1. API — CRUD

**POST /api/requests — Create**

| ID | Pri | Type | Title |
|----|-----|------|-------|
| R-SMOKE-01 | P0 | Regression | Create request → pending (happy path) |
| F-REQ-03 | P0 | Functional | Create with invalid/missing userId |

**GET /api/requests/{id} — Read**

| ID | Pri | Type | Title |
|----|-----|------|-------|
| R-SMOKE-05 | P0 | Regression | GET request details match DB (after transitions) |
| F-REQ-07 | P1 | Functional | GET non-existent requestId → 404 |

**PATCH /internal/requests/{id}/status — Update**

| ID | Pri | Type | Title |
|----|-----|------|-------|
| F-REQ-04 | P0 | Functional | PATCH status to approved/denied |
| F-REQ-05 | P0 | Functional | Illegal status transitions rejected |

### 2. API — Internal & security

| ID | Pri | Type | Title |
|----|-----|------|-------|
| F-EMAIL-DIR-01 | P1 | Functional | Direct email send for approved request |
| S-01 | P1 | Functional | Internal APIs reject unauthorized calls |
| S-02 | P1 | Functional | Cross-tenant / cross-user status update denied |

### 3. End-to-end spine

| ID | Pri | Type | Title |
|----|-----|------|-------|
| E2E-01 | P0 | Functional | E2E: create pending → external approve → job emails → GET confirms |

### 4. Job — email

| ID | Pri | Type | Title |
|----|-----|------|-------|
| R-SMOKE-02 | P0 | Regression | Approve → job → emailed once (no duplicates) |
| R-SMOKE-04 | P0 | Regression | Non-approved statuses → no email |

### 5. Job — external (~2 min)

| ID | Pri | Type | Title |
|----|-----|------|-------|
| F-EXT-01 | P0 | Functional | External ~2m job: approved, denied, or stay pending |
| N-TIME-02 | P1 | Non-functional | External ~2m update — no premature email |

### 6. Job — expiry & observability

| ID | Pri | Type | Title |
|----|-----|------|-------|
| R-SMOKE-03 | P0 | Regression | Aged pending → expired, not emailed |
| F-EXP-02 | P0 | Functional | Pending <30m → stays pending |
| F-EXP-03 | P0 | Functional | Approved/denied not auto-expired |
| N-TIME-01 | P1 | Non-functional | Expiry boundary 29m59s vs 30m00s |
| N-JOB-03 | P1 | Non-functional | Concurrent runs / multi-server — no dupes |
| N-PERF-01 | P2 | Non-functional | Backlog of N approved-unsent processed |
| R-SMOKE-06 | P0 | Regression | Cron history row on successful run |
| N-JOB-01 | P1 | Non-functional | Cron cadence ~5s in history |
| N-OBS-01 | P1 | Non-functional | Failed job → history failed + logs |

### 7. UI & data

| ID | Pri | Type | Title |
|----|-----|------|-------|
| F-UI-01 | P1 | Functional | UI submit creates pending request |
| F-REQ-06 | P2 | Functional | Priority field stored; no unintended ordering |

**Totals:** 25 cases · 6 regression smoke · 14 functional · 8 non-functional · 11 P0 · 11 P1 · 3 P2

---

## Release flow — metrics, logs & monitoring

Derived from the **Release Metrics** sheet. Test oracles define what “healthy” looks like; the same signals become dashboard KPIs after deploy.

### Pre-release gate (staging)

| Gate | Pass criteria |
|------|---------------|
| Smoke regression | 6/6 `Regression?=Yes` cases Pass |
| P0 functional | 100% P0 Pass (or waived with sign-off) |
| No stuck backlog | `approved_unsent_backlog = 0` after test run (M3 oracle from R-SMOKE-02) |
| No stale pending | `pending_stale_count = 0` after expiry tests (M7 oracle from R-SMOKE-03) |
| Cron observability | `job.process_completed` logged; `CRON_TASK_HISTORY` success (R-SMOKE-06, L8–L9) |
| Dashboard wired | M1, M3, M7, M10 live in staging before prod promote |

### Post-release metrics (M1–M16)

| ID | Metric | SLO / target | Alert when |
|----|--------|--------------|------------|
| M1 | `requests_created_total` | Baseline | Spike >3× 7d avg or drop to 0 for 15m |
| M2 | `requests_by_status` | Informational | Pending growing unbounded >24h |
| M3 | `approved_unsent_backlog` | 0 steady-state | **>0 for >5 min (P0)** |
| M4 | `email_send_success_total` | Match approved transitions | — |
| M5 | `email_send_failure_total` | 0 steady-state | >0 sustained 5m |
| M6 | `email_duplicate_prevented` | Informational | Unexpected spike (race) |
| M7 | `pending_stale_count` | 0 | **>0 (P0 — expiry job broken)** |
| M8 | `pending_to_terminal_latency` | External job ~120s p95 | p95 >180s for 15m |
| M9 | `expiry_job_lag` | <1800s max | >1860s (30m + 60s grace) |
| M10 | `cron_job_success_rate` | >99% | <95% for 10m |
| M11 | `cron_job_duration` | p95 <2000ms | p95 >5000ms |
| M12 | `cron_processed_records` | Matches backlog cleared | 0 for 3+ runs while M3>0 |
| M13 | `cron_run_interval` | ~5s | >15s gap (missed runs) |
| M14 | `api_request_create_error_rate` | <1% | >5% for 5m |
| M15 | `api_get_not_found_rate` | Baseline | Spike >3× |
| M16 | `internal_api_auth_failure_rate` | Low in prod | Any from unexpected IP |

### Structured log events (L1–L12)

| ID | Event | Level | Dashboard use |
|----|-------|-------|---------------|
| L1 | `request.created` | INFO | Create volume (M1) |
| L2 | `request.status_changed` | INFO | Status funnel (M2) |
| L3 | `email.send_attempt` | INFO | Email pipeline |
| L4 | `email.send_success` | INFO | Send success (M4) |
| L5 | `email.send_failure` | ERROR | Failure alert (M5) |
| L6 | `email.skipped_already_sent` | WARN | Idempotency / race (M6) |
| L7 | `request.expired` | INFO | Expiry validation (M7) |
| L8 | `job.process_started` | INFO | Cron cadence (M13) |
| L9 | `job.process_completed` | INFO | Job health (M10–M12) |
| L10 | `job.process_failed` | ERROR | Job failure alert (M10) |
| L11 | `audit.action` | INFO | Audit trail panel |
| L12 | `api.error` | WARN | API error overview (M14–M16) |

### Production alerts (A1–A8)

| ID | Severity | Condition | First runbook step |
|----|----------|-----------|-------------------|
| A1 | P0 Critical | `approved_unsent_backlog > 0` for 5m | Check email provider + N-OBS-01 path; inspect `REQUESTS WHERE approved AND NOT email_sent` |
| A2 | P0 Critical | `pending_stale_count > 0` (pending >30m) | Verify 5s cron running; check `CRON_TASK_HISTORY` gaps |
| A3 | P0 Critical | `email_send_failure_total > 0` for 5m | Provider status page; sample L5 logs; do not mass-set `email_sent=true` |
| A4 | P1 High | `cron_job_success_rate < 95%` over 10m | Inspect L10; check `server_name` distribution (multi-server race) |
| A5 | P1 High | `cron_run_interval > 15s` | Cron scheduler health; pod restarts |
| A6 | P1 High | `pending_to_terminal_latency` p95 >180s | External ~2m job lag; queue depth |
| A7 | P2 Medium | `api_request_create_error_rate > 5%` | Recent deploy? DB connectivity? Sample F-REQ-03 failures |
| A8 | P2 Medium | `email_duplicate_prevented` spike | Review N-JOB-03; check concurrent cron without lock |

### Suggested dashboard panels

- **Request funnel** — M2: pending → approved / denied / expired over time
- **Email pipeline health** — M3 backlog, M4 success, M5 failures
- **Expiry SLA** — M7, M9, L7 (gauge + table of stale IDs)
- **Cron job health** — M10 success rate, M11 duration, M12 processed records, M13 interval
- **External job latency** — M8 p50/p95/p99 histogram
- **API error overview** — M14, M15, L12 by path + status
- **Audit trail drill-down** — L11 + `AUDIT_LOGS` entity lookup
