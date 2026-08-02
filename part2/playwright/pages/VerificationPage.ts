import { expect, Page } from '@playwright/test';
import { VerificationMessages } from '../constants/messages';
import { Urls, VerificationCopy } from '../constants/urls';
import { BasePage } from './BasePage';

export class VerificationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async expectLoaded(email?: string): Promise<void> {
    await expect(this.page).toHaveURL(Urls.emailVerificationPattern);
    await expect(
      this.page.getByText(VerificationCopy.verifyPrompt, { exact: true }),
    ).toBeVisible();

    if (email) {
      await expect(this.page.getByText(email)).toBeVisible();
    }

    if (this.page.url().includes(Urls.emailVerificationOtpPath)) {
      await this.expectOtpInputsReady();
      await expect(
        this.page.getByText(VerificationCopy.otpSentPrefix, { exact: false }),
      ).toBeVisible();
      return;
    }

    await expect(this.page).toHaveURL(
      new RegExp(Urls.emailVerificationSentPath),
    );
    await expect(
      this.page.getByText(VerificationCopy.linkSentPrefix, { exact: false }),
    ).toBeVisible();
  }

  async expectOtpFlow(email: string): Promise<void> {
    await expect(this.page).toHaveURL(/\/email-verification\/otp/);
    await expect(
      this.page.getByText(VerificationCopy.verifyPrompt, { exact: true }),
    ).toBeVisible();
    await expect(this.page.getByText(email)).toBeVisible();
    await expect(
      this.page.getByText(VerificationCopy.otpSentPrefix, { exact: false }),
    ).toBeVisible();
    await this.expectOtpInputsReady();
  }

  private otpInputs() {
    return this.page.getByRole('textbox', { name: /Input verification code/i });
  }

  private async expectOtpInputsReady(): Promise<void> {
    await expect(this.otpInputs()).toHaveCount(6);
  }

  async enterCode(code: string): Promise<void> {
    const digits = code.replace(/\D/g, '').slice(0, 6);
    const inputs = this.otpInputs();

    await expect(inputs).toHaveCount(6);

    for (let i = 0; i < 6; i += 1) {
      await inputs.nth(i).fill(digits[i] ?? '');
    }
  }

  private async waitForVerificationOutcome(): Promise<void> {
    const errorText = this.page.getByText(VerificationMessages.invalidOtp, {
      exact: true,
    });

    await expect(async () => {
      const stillOnOtp = this.page.url().includes(Urls.emailVerificationOtpPath);
      if (!stillOnOtp) return;

      const hasError = await errorText.isVisible();
      if (hasError) return;

      throw new Error('Waiting for OTP verification to succeed or show an error');
    }).toPass();
  }

  async verify(code: string): Promise<void> {
    await this.enterCode(code);
    await this.waitForVerificationOutcome();
  }

  async expectVerificationSuccess(): Promise<void> {
    await expect(this.page).not.toHaveURL(Urls.emailVerificationPattern);
    await expect(this.page).not.toHaveURL(new RegExp(Urls.signupPath));
    await expect(
      this.page.getByText(VerificationCopy.verifyPrompt, { exact: true }),
    ).not.toBeVisible();
  }

  async expectInvalidCodeError(): Promise<void> {
    await expect(this.page).toHaveURL(/\/email-verification\/otp/);
    await expect(
      this.page.getByText(VerificationMessages.invalidOtp, { exact: true }),
    ).toBeVisible();
    await expect(this.otpInputs().first()).toHaveAttribute('aria-invalid', 'true');
  }
}
