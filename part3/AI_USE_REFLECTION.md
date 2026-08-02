# Part 3 — AI Use Reflection

- I used AI (Cursor) across the assignment: for **Part 1**, to draft the risk-based test plan, build the Excel workbook, merge duplicate cases into a single “By Action” sheet, and add Submission Notes and Release Metrics; for **Part 2**, to scaffold the Playwright + TypeScript framework, explore the canary signup flow, implement Mailinator OTP retrieval, and run code-review/fix iterations (prompts attached in [`part2/prompts/`](../part2/prompts/)).

- For **Part 2 automation** specifically, AI helped with Page Objects, fixtures, Faker-based test data, constants, and the five signup scenarios (registration, OTP verification, empty form, weak password, invalid OTP).

- AI’s first pass for **state selection and verification** was wrong or incomplete: it used `getByRole('combobox')` / `getByRole('option')` and `waitForTimeout` sleeps, assumed a single post-signup verification route, and used a generic OTP error regex — on Talkspace canary the State control doesn’t expose those roles reliably, verification can route to OTP (`/otp`) or link (`/sent`), and the real error text is `"Error validating OTP"`.

- I caught this by **running `npm test` after each change**, reviewing failure screenshots, traces, and ARIA snapshots, and comparing against manual signup on canary; I fixed it with `getByLabel('State')` + keyboard Enter after typeahead, Playwright `expect` auto-wait (no implicit sleeps), the correct error message constant, and `registerUntilOtpFlow()` to handle canary’s OTP vs link split.

- I **overrode AI** when it added two extra tests (7 total) while the brief requires 5, when it introduced `timeouts.ts` and sleep-based waits instead of config-level timeouts, and when Part 1 had duplicate smoke/functional cases — I merged those manually, kept the suite lean, and verified the final run locally (**5/5 passing**) before pushing.
