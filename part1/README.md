# Part 1 — Request Lifecycle Test Plan

**Assignment:** Talkspace Senior Full Stack QA Engineer take-home (Part 1, ~40 min written)

## Files

| File | Purpose |
|------|---------|
| `Part1_Request_Lifecycle_RBT_Test_Plan.xlsx` | **Submit this** — execution workbook |
| `Part1_Request_Lifecycle_RBT_Test_Plan.md` | Markdown companion (earlier draft; Excel is source of truth) |

## Quick start for reviewers

1. Open **Submission Notes** — assumptions, ambiguities, feature feedback
2. Open **Test Cases** — 25 RBT cases; filter `Regression?=Yes` for 6-case smoke pack
3. Open **Release Metrics** — post-release monitoring blueprint (metrics, logs, alerts)

## Scope covered

- UI / API create → `pending`
- External ~2 min status update (approved / denied / stay pending)
- 5s scheduled job: approval email + 30m expiry
- Client + internal APIs, DB (`REQUESTS`, `AUDIT_LOGS`, `CRON_TASK_HISTORY`), app logs
