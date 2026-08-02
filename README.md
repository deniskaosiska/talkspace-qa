# Talkspace QA — Take-Home Assignment

Senior Full Stack QA Engineer homework submission.

## Contents

| Part | Folder | Status |
|------|--------|--------|
| **Part 1** — Test Plan (written) | [`part1/`](part1/) | Included |
| **Part 2** — Playwright automation | [`part2/playwright/`](part2/playwright/) | Included |
| Part 3 — AI use reflection | `part3/` | Pending |

## Part 1

Risk-based test plan for the request lifecycle feature (create → pending → external status update → 5s job email/expiry).

- **Primary deliverable:** [`part1/Part1_Request_Lifecycle_RBT_Test_Plan.xlsx`](part1/Part1_Request_Lifecycle_RBT_Test_Plan.xlsx)
- **Markdown reference:** [`part1/Part1_Request_Lifecycle_RBT_Test_Plan.md`](part1/Part1_Request_Lifecycle_RBT_Test_Plan.md)

Excel workbook sheets:

- **Test Cases** — 25 cases grouped by action (API, jobs, DB, UI, E2E)
- **Submission Notes** — assumptions, ambiguities, risks, feature feedback
- **Release Metrics** — prod dashboard metrics, logs, alerts
- **Action Summary**, **Risk Register**, **Bug Log**

## Part 2

Playwright + TypeScript signup automation for `https://app.canary.talkspace.com/signup/autoswitchpt`.

```bash
cd part2/playwright
npm install
npx playwright install chromium
npm test
```

- **5 tests** — registration, OTP verification, empty form, weak password, invalid OTP
- **POM** — `SignupPage`, `VerificationPage`, `StateSelectComponent`
- **Mail** — Mailinator public API for OTP retrieval
- See [`part2/README.md`](part2/README.md) and [`part2/prompts/playwright-setup.md`](part2/prompts/playwright-setup.md)
