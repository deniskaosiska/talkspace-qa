# Part 2 — Playwright Signup Automation

Talkspace take-home **Part 2**: automated tests for [autoswitchpt signup](https://app.canary.talkspace.com/signup/autoswitchpt).

## Overview

A small, production-style Playwright suite — **5 tests**, one spec file, three page objects. Built for a take-home, not a platform.

**Design principles**

| Principle | How it shows up |
|-----------|-----------------|
| **Right-sized** | No Page Factory, no custom reporter, no API layer — only what 5 signup tests need |
| **POM where it helps** | Tests call `signupPage.register()`, not raw locators |
| **Playwright-native waits** | No `waitForTimeout`; `expect` auto-retry + `expect.poll()` for Mailinator only |
| **Strong locators** | `getByRole`, `getByLabel`, `getByText` — no XPath or CSS chains |
| **Debuggable failures** | Screenshot, video, trace, ARIA snapshot + log on failure |
| **Canary-aware** | OTP vs link verification A/B handled with `registerUntilOtpFlow()` retries |

**Intentionally not built** (would be over-engineering for this scope)

- Multi-browser matrix, sharding, or parallel signup workers
- Separate API/client abstraction layers
- Custom timeout config files — UI timeouts live in `playwright.config.ts`
- Page objects for every static label or footer link
- CI pipeline (config is CI-ready; workflow left to the reviewer’s infra)

**Layout (~15 source files)**

```
tests/signup.spec.ts          ← 5 scenarios, business-readable
pages/                        ← SignupPage, VerificationPage, StateSelect
fixtures/test.fixture.ts      ← page objects, freshUser, failure attachments
data/                         ← weakPassword, invalidOtpCode, default state
constants/                    ← URLs, UI copy, validation messages
utils/                        ← Faker user factory, Mailinator OTP helper
```

---

## Verification flow (Phase 0 findings)

| Step | Behavior |
|------|----------|
| Signup URL | `/signup/autoswitchpt` |
| Fields | Email, Password (min 8), Nickname (max 10 chars), Country, State |
| Submit | Navigates to `/email-verification/otp` **or** `/email-verification/sent` (canary A/B) |
| OTP route | 6 labeled textboxes (`Input verification code 1` … `6`) + one-time code email |
| Link route | Verification link email (no OTP inputs) |
| Mail helper | Mailinator public API (`mailinator.com`) |

## Setup

```bash
cd part2/playwright
npm install
npx playwright install chromium
cp .env.example .env
```

## Run tests

```bash
# All tests (4 always + 1 @mail unless disabled in CI)
npm test

# Headed debugging
npm run test:headed

# Mail-dependent OTP happy path only
npm run test:mail

# HTML report
npm run test:report
```

## Five tests

1. **Positive** — register → email verification screen (OTP or link flow)
2. **Positive `@mail`** — full signup + OTP from Mailinator inbox
3. **Negative** — empty form validation (email, password, nickname, state)
4. **Negative** — password shorter than 8 characters
5. **Negative** — invalid OTP after successful registration

## Test data

| Constant | File | Purpose |
|----------|------|---------|
| `weakPassword` | `data/users.ts` | Password min-length negative |
| `invalidOtpCode` | `data/verification.ts` | OTP rejection negative |
| `freshUser` | fixture | Unique Mailinator email per test via Faker |

## Email strategy

- Unique emails: `qa.auto.{timestamp}@mailinator.com` (Faker + timestamp)
- `utils/mail.ts` polls Mailinator via `expect.poll()` and extracts 6-digit code
- OTP tests call `registerUntilOtpFlow()` — retries up to 5 signups if canary returns link verification
- `@mail` runs locally by default. In CI, set `MAILINATOR_DOMAIN=mailinator.com` or `MAILINATOR_DOMAIN=skip` to disable

## Locator & wait strategy

- **No implicit sleeps** — UI sync uses Playwright `expect` auto-retry, `expect().toPass()`, and `expect.poll()` (mail API only)
- **Strong locators** — `getByRole`, `getByLabel`, `getByText`; no XPath/CSS chains
- **UI timeouts** — `playwright.config.ts` only (`expect`, `action`, `navigation`)
- **Mail poll tuning** — optional env vars in `.env`: `OTP_TIMEOUT_MS`, `OTP_POLL_INTERVAL_MS`

## Failure artifacts

On failure, Playwright retains **screenshot**, **video**, and **trace**, and the test fixture attaches:

- `failure-log` — URL, title, and console error output
- `aria-snapshot` — accessibility tree snapshot for debugging

Open the HTML report: `npm run test:report`
