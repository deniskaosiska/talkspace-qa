import { expect, Page } from '@playwright/test';
import { SignupMessages } from '../constants/messages';
import { SignupCopy, Urls } from '../constants/urls';
import { TestUser } from '../types/user.types';
import { BasePage } from './BasePage';
import { StateSelectComponent } from './components/StateSelect.component';

export class SignupPage extends BasePage {
  private readonly stateSelect: StateSelectComponent;

  constructor(page: Page) {
    super(page);
    this.stateSelect = new StateSelectComponent(page);
  }

  async open(): Promise<void> {
    await this.gotoPath(Urls.signupPath);
    await this.expectOnSignupPage();
  }

  async expectOnSignupPage(): Promise<void> {
    await expect(
      this.page.getByRole('heading', { name: SignupCopy.pageHeading, level: 1 }),
    ).toBeVisible();
  }

  async fillEmail(email: string): Promise<void> {
    await this.locatorByLabel('Email').fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.locatorByLabel('Password').fill(password);
  }

  async fillNickname(nickname: string): Promise<void> {
    await this.locatorByLabel('Nickname').fill(nickname);
  }

  async selectState(state: string): Promise<void> {
    await this.stateSelect.selectState(state);
  }

  async submit(): Promise<void> {
    await this.page
      .getByRole('button', { name: SignupCopy.createAccountButton })
      .click();
  }

  async register(user: TestUser): Promise<void> {
    await this.fillEmail(user.email);
    await this.fillPassword(user.password);
    await this.fillNickname(user.nickname);
    await this.selectState(user.state);
    await this.submit();
    await expect(this.page).toHaveURL(Urls.emailVerificationPattern);
  }

  /**
   * Canary may A/B route to OTP or link verification. Retries signup with a fresh
   * user until the OTP screen appears (max 2 attempts).
   */
  async registerUntilOtpFlow(
    createUser: () => TestUser,
    maxAttempts = 5,
  ): Promise<TestUser> {
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const user = createUser();
      await this.open();
      await this.register(user);

      if (this.page.url().includes(Urls.emailVerificationOtpPath)) {
        return user;
      }
    }

    throw new Error(
      `Talkspace routed to link verification (${Urls.emailVerificationSentPath}) instead of OTP after ${maxAttempts} attempts`,
    );
  }

  async expectValidationMessages(messages: string[]): Promise<void> {
    for (const message of messages) {
      await expect(this.page.getByText(message, { exact: true })).toBeVisible();
    }
  }

  async expectEmptyFormValidation(): Promise<void> {
    await this.expectValidationMessages([
      SignupMessages.emailRequired,
      SignupMessages.passwordRequired,
      SignupMessages.nicknameRequired,
      SignupMessages.stateRequired,
    ]);
  }

  async expectWeakPasswordValidation(): Promise<void> {
    await expect(
      this.page.getByText(SignupMessages.passwordMinLength, { exact: true }),
    ).toBeVisible();
    await this.expectOnSignupPage();
  }
}
