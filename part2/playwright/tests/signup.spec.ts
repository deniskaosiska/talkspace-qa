import { weakPassword } from '../data/users';
import { invalidOtpCode } from '../data/verification';
import { createFreshUser } from '../fixtures/user.fixture';
import { fetchVerificationCode } from '../utils/mail';
import { test } from '../fixtures/test.fixture';

test.describe('Talkspace autoswitchpt signup', () => {
  test('registers a new user and lands on email verification', async ({
    signupPage,
    verificationPage,
    freshUser,
  }) => {
    await signupPage.open();
    await signupPage.register(freshUser);
    await verificationPage.expectLoaded(freshUser.email);
  });

  test('@mail completes signup with email OTP verification', async ({
    signupPage,
    verificationPage,
  }) => {
    test.skip(
      !!process.env.CI && process.env.MAILINATOR_DOMAIN === 'skip',
      'Mail tests disabled in CI (set MAILINATOR_DOMAIN=mailinator.com to enable)',
    );

    const user = await signupPage.registerUntilOtpFlow(createFreshUser);
    await verificationPage.expectOtpFlow(user.email);

    const otp = await fetchVerificationCode(user.email);
    await verificationPage.verify(otp);
    await verificationPage.expectVerificationSuccess();
  });

  test('shows validation errors when submitting an empty form', async ({
    signupPage,
  }) => {
    await signupPage.open();
    await signupPage.submit();
    await signupPage.expectEmptyFormValidation();
  });

  test('rejects a password shorter than 8 characters', async ({
    signupPage,
    freshUser,
  }) => {
    await signupPage.open();
    await signupPage.fillEmail(freshUser.email);
    await signupPage.fillPassword(weakPassword);
    await signupPage.fillNickname(freshUser.nickname);
    await signupPage.selectState(freshUser.state);
    await signupPage.submit();
    await signupPage.expectWeakPasswordValidation();
  });

  test('rejects an invalid verification code', async ({
    signupPage,
    verificationPage,
  }) => {
    const user = await signupPage.registerUntilOtpFlow(createFreshUser);
    await verificationPage.expectOtpFlow(user.email);

    await verificationPage.verify(invalidOtpCode);
    await verificationPage.expectInvalidCodeError();
  });
});
