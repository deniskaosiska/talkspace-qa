import { expect, Page } from '@playwright/test';
import { VerificationMessages } from '../constants/messages';
import { Urls, VerificationCopy } from '../constants/urls';
import { Timeouts } from '../constants/timeouts';
import { BasePage } from './BasePage';

export class VerificationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async expectLoaded(email?: string): Promise<void> {
    await expect(this.page).toHaveURL(Urls.emailVerificationPattern);
    await expect(this.page.getByText(VerificationCopy.verifyPrompt)).toBeVisible();
    if (email) {
      await expect(this.page.getByText(email)).toBeVisible();
    }
  }

  private otpInputs() {
    return this.page.locator('input[type="tel"]:visible');
  }

  async enterCode(code: string): Promise<void> {
    const digits = code.replace(/\D/g, '').slice(0, 6);
    const inputs = this.otpInputs();
    const count = await inputs.count();

    if (count >= 6) {
      for (let i = 0; i < 6; i += 1) {
        await inputs.nth(i).fill(digits[i] ?? '');
      }
      return;
    }

    await this.page.getByRole('textbox').first().fill(digits);
  }

  async verify(code: string): Promise<void> {
    await this.enterCode(code);
    await this.page.waitForTimeout(Timeouts.postSubmitMs);
  }

  async expectVerificationSuccess(): Promise<void> {
    await expect(this.page).not.toHaveURL(/\/email-verification\/otp/);
  }

  async expectInvalidCodeError(): Promise<void> {
    const hasErrorText = this.page.getByText(VerificationMessages.invalidCodePattern);
    const stillOnOtp = this.page.url().includes('/email-verification');

    if (await hasErrorText.count()) {
      await expect(hasErrorText.first()).toBeVisible();
      return;
    }

    expect(stillOnOtp).toBeTruthy();
    await expect(this.page.getByText(VerificationCopy.verifyPrompt)).toBeVisible();
  }
}
