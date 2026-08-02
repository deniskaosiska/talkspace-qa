import { expect, Page } from '@playwright/test';
import { SignupMessages } from '../constants/messages';
import { SignupCopy, Urls } from '../constants/urls';
import { Timeouts } from '../constants/timeouts';
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
      this.page.getByRole('heading', { name: SignupCopy.pageHeading }),
    ).toBeVisible();
  }

  async fillEmail(email: string): Promise<void> {
    await this.page.getByPlaceholder('Email').fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.page.getByPlaceholder('Enter password').fill(password);
  }

  async fillNickname(nickname: string): Promise<void> {
    await this.page.getByPlaceholder('Enter nickname').fill(nickname);
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
    await this.page.waitForTimeout(Timeouts.spaSettleMs);
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
