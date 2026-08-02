import { test as base } from '@playwright/test';
import { SignupPage } from '../pages/SignupPage';
import { VerificationPage } from '../pages/VerificationPage';
import { TestUser } from '../types/user.types';
import { createFreshUser } from './user.fixture';

type TalkspaceFixtures = {
  signupPage: SignupPage;
  verificationPage: VerificationPage;
  freshUser: TestUser;
};

export const test = base.extend<TalkspaceFixtures>({
  page: async ({ page }, use, testInfo) => {
    await use(page);

    if (testInfo.status === testInfo.expectedStatus) return;

    const url = page.url();
    const title = await page.title().catch(() => '(unavailable)');

    let ariaSnapshot = '(unavailable)';
    try {
      ariaSnapshot = await page.locator('body').ariaSnapshot();
    } catch {
      /* page may already be closed */
    }

    const failureLog = [
      `[FAILED] ${testInfo.title}`,
      `Project: ${testInfo.project.name}`,
      `File: ${testInfo.file}`,
      `URL: ${url}`,
      `Title: ${title}`,
      '--- ARIA snapshot ---',
      ariaSnapshot,
    ].join('\n');

    console.error(failureLog);

    await testInfo.attach('failure-log', {
      body: failureLog,
      contentType: 'text/plain',
    });

    await testInfo.attach('aria-snapshot', {
      body: ariaSnapshot,
      contentType: 'text/yaml',
    });
  },

  freshUser: async ({}, use) => {
    await use(createFreshUser());
  },

  signupPage: async ({ page }, use) => {
    await use(new SignupPage(page));
  },

  verificationPage: async ({ page }, use) => {
    await use(new VerificationPage(page));
  },
});

export { expect } from '@playwright/test';
