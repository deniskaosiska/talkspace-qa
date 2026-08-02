# AI prompts used — Part 2 Playwright framework

## Initial framework request (summary)

Senior QA Automation Engineer brief:

- Target: https://app.canary.talkspace.com/signup/autoswitchpt
- 5 Playwright + TypeScript tests (registration + email verification)
- Page Object Model, fixtures, Faker, robust locators, production-quality structure
- Investigate email verification strategy before coding (do not guess)

## Follow-up corrections applied manually

1. **Nickname max length** — exploration found `Must be shorter than 11 characters`; Faker nicknames capped at 10 chars
2. **OTP UI** — 6 `tel` inputs confirmed; `VerificationPage.enterCode()` fills each digit
3. **Mailinator API** — public inbox at `mailinator.com/api/v2/domains/public/` (no API key)
4. **State combobox** — `getByLabel('State')` + typeahead; fallback ArrowDown+Enter
5. **Removed duplicate weak-password assertion** — kept single POM method

## Verification performed after AI output

- Headless Playwright exploration of signup form validations
- Successful registration → `/email-verification/otp` URL pattern
- Mailinator inbox fetch for Talkspace OTP email body
