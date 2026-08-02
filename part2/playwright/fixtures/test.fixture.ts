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
