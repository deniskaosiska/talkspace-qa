# Talkspace QA — Take-Home Assignment

Senior Full Stack QA Engineer homework submission.

## Contents

| Part | Folder | Status |
|------|--------|--------|
| **Part 1** — Test Plan (written) | [`part1/`](part1/) | Included |
| **Part 2** — Playwright automation | [`part2/playwright/`](part2/playwright/) | Included |
| **Part 3** — AI use reflection | [`part3/`](part3/) | Included |

## Part 1

Risk-based test plan for the request lifecycle feature (create → pending → external status update → 5s job email/expiry).

- **Primary deliverable:** [`part1/Part1_Request_Lifecycle_RBT_Test_Plan.xlsx`](part1/Part1_Request_Lifecycle_RBT_Test_Plan.xlsx)
- **Submission body:** [`part1/README.md`](part1/README.md) — full test case list (25) + release metrics / monitoring flow
- **Markdown reference:** [`part1/Part1_Request_Lifecycle_RBT_Test_Plan.md`](part1/Part1_Request_Lifecycle_RBT_Test_Plan.md)

Excel workbook sheets:

- **Test Cases** — 25 cases grouped by action (API, jobs, DB, UI, E2E); 6 regression smoke
- **Submission Notes** — assumptions, ambiguities, risks, feature feedback
- **Release Metrics** — prod dashboard metrics (M1–M16), logs (L1–L12), alerts (A1–A8), release gate
- **Action Summary**, **Risk Register**, **Bug Log**

## Part 2

Playwright + TypeScript signup automation for `https://app.canary.talkspace.com/signup/autoswitchpt`.

**Overview:** 5 tests, POM, Playwright-native waits, Mailinator OTP — lean and production-style (see [`part2/README.md`](part2/README.md)).

```bash
cd part2/playwright
npm install
npx playwright install chromium
npm test
```

- **5 tests** — registration, OTP verification, empty form, weak password, invalid OTP
- **POM** — `SignupPage`, `VerificationPage`, `StateSelectComponent`
- **Mail** — Mailinator public API for OTP retrieval
- See [`part2/README.md`](part2/README.md) and [`part2/prompts/`](part2/prompts/) (AI prompts used)

## Part 3

AI use reflection (~5 bullet points) for the take-home assignment.

- **Deliverable:** [`part3/AI_USE_REFLECTION.md`](part3/AI_USE_REFLECTION.md)
- Covers what AI was used for, one wrong/incomplete example, and deliberate overrides
