# Part 2 — Playwright Signup Automation

Talkspace take-home **Part 2**: automated tests for [autoswitchpt signup](https://app.canary.talkspace.com/signup/autoswitchpt).

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

## Project structure

```
playwright/
├── pages/           # POM — SignupPage, VerificationPage, StateSelect
├── tests/           # signup.spec.ts (5 scenarios)
├── fixtures/        # page objects + freshUser + failure logging
├── utils/           # faker, mail OTP fetch (expect.poll)
├── constants/       # URLs, validation messages
└── data/            # defaults (state, weak password)
```

## Five tests

1. **Positive** — register → email verification screen (OTP or link flow)
2. **Positive `@mail`** — full signup + OTP from Mailinator inbox
3. **Negative** — empty form validation (email, password, nickname, state)
4. **Negative** — password shorter than 8 characters
5. **Negative** — invalid OTP after successful registration

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
