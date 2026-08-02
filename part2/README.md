# Part 2 — Playwright Signup Automation

Talkspace take-home **Part 2**: automated tests for [autoswitchpt signup](https://app.canary.talkspace.com/signup/autoswitchpt).

## Verification flow (Phase 0 findings)

| Step | Behavior |
|------|----------|
| Signup URL | `/signup/autoswitchpt` |
| Fields | Email, Password (min 8), Nickname (max 10 chars), Country, State |
| Submit | Navigates to `/email-verification/otp?email=...&token=...&otpToken=...` |
| Verify UI | Heading: *Before matching with a provider, verify your email* |
| OTP input | **6 separate `tel` inputs** (one digit each) |
| Email | Talkspace sends **6-digit OTP** via email (expires ~10 min) |
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
# All tests (4 always + 1 @mail if env set)
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
├── fixtures/        # page objects + freshUser
├── utils/           # faker, mail OTP fetch, poll helper
├── constants/       # URLs, validation messages, timeouts
└── data/            # defaults (state, weak password)
```

## Five tests

1. **Positive** — register → email verification screen
2. **Positive `@mail`** — full signup + OTP from Mailinator inbox
3. **Negative** — empty form validation (email, password, nickname, state)
4. **Negative** — password shorter than 8 characters
5. **Negative** — invalid OTP after successful registration

## Email strategy

- Unique emails: `qa.auto.{timestamp}@mailinator.com` (Faker + timestamp)
- `utils/mail.ts` polls Mailinator public inbox API and extracts 6-digit code
- `@mail` test skipped if `MAILINATOR_DOMAIN` unset in CI without inbox access

## Known flakiness / notes

- SPA never reaches `networkidle` — tests use `domcontentloaded` + explicit expects
- State combobox is custom autocomplete — encapsulated in `StateSelectComponent`
- Canary staging may rate-limit parallel signups — `workers: 1` in config
