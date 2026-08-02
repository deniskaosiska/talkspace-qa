# Prompt 01 — Part 2 framework brief

so lets move to the part 2.
You are acting as a **Senior QA Automation Engineer** with extensive experience in **Playwright + TypeScript**. Your goal is to build a production-quality automation framework for this assignment.

## Task

Go to:

https://app.canary.talkspace.com/signup/autoswitchpt

Create **5 automated Playwright tests** covering the complete signup flow, including:

* User registration
* Email verification
* Positive scenarios
* Negative scenarios where appropriate

Do not skip any validation that should reasonably be tested.

---

## Framework Requirements

Build the framework exactly as if it were used in a real company.

Use the latest Playwright with TypeScript.

Follow best practices including:

* Page Object Model (POM)
* Reusable page methods
* Clean project structure
* DRY principles
* Readable code
* Strong typing
* Proper naming conventions
* Minimal code duplication

Suggested structure:

```
playwright/
│
├── pages/
│   ├── BasePage.ts
│   ├── SignupPage.ts
│   ├── VerificationPage.ts
│
├── tests/
│   └── signup.spec.ts
│
├── fixtures/
│   ├── test.fixture.ts
│   └── user.fixture.ts
│
├── utils/
│   ├── faker.ts
│   ├── mail.ts
│   ├── wait.ts
│
├── data/
│   └── users.ts
│
├── playwright.config.ts
└── package.json
```

Feel free to improve this structure if there is a cleaner industry-standard approach.

---

## Page Object Rules

Each page should expose only business actions.

Example:

```
signupPage.open()
signupPage.register(user)
signupPage.submit()

verificationPage.enterCode(...)
verificationPage.verify()
```

Avoid exposing low-level locator interactions inside the tests.

Tests should read like business scenarios rather than UI scripts.

---

## Fixtures

Use Playwright fixtures where appropriate.

Examples:

* page objects
* generated users
* reusable setup
* shared configuration

Avoid unnecessary fixtures.

---

## Test Data

Generate users dynamically.

Prefer Faker over hardcoded values.

Separate test data from tests.

---

## Locators

Use robust locators in this order of preference:

1. getByRole
2. getByLabel
3. getByPlaceholder
4. getByTestId
5. CSS only when necessary

Avoid brittle XPath selectors unless absolutely required.

---

## Assertions

Use Playwright's built-in assertions.

Assert meaningful UI behavior, not implementation details.

Examples:

* successful navigation
* validation messages
* button state
* verification success
* error handling

---

## Configuration

Configure:

* retries
* HTML reporter
* screenshots on failure
* traces on retry
* videos on failure

Keep configuration interview-ready.

---

## Code Quality

Keep methods small.

No duplicated code.

No magic strings.

Extract constants where appropriate.

Add comments only when they improve understanding.

---

## Email Verification

First inspect how the application performs email verification.

Determine whether it:

* sends a real email
* uses a verification code
* uses a verification link
* calls an API
* uses a mock service

Choose the most maintainable automation strategy.

Do not guess—investigate first.

---

## Before Writing Tests

Explore the application carefully.

Understand:

* all pages
* validations
* required fields
* API calls
* network requests
* redirects
* verification flow

Only then design the framework.

---

## Deliverables

Generate:

* complete framework
* all page objects
* fixtures
* configuration
* utilities
* 5 clean tests

The code should be organized exactly as it would be in a professional GitHub repository and be suitable for discussion during a senior QA automation interview.

If you identify opportunities to improve the architecture while implementing, explain your reasoning before making those changes.
