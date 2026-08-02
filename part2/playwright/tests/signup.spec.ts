import { weakPassword } from '../data/users';
import { fetchVerificationCode } from '../utils/mail';
import { expect, test } from '../fixtures/test.fixture';

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
    freshUser,
  }) => {
    test.skip(
      !process.env.MAILINATOR_DOMAIN && !process.env.CI,
      'Mailinator domain not configured',
    );

    await signupPage.open();
    await signupPage.register(freshUser);
    await verificationPage.expectLoaded(freshUser.email);

    const otp = await fetchVerificationCode(freshUser.email);
    expect(otp).toMatch(/^\d{6}$/);

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
    freshUser,
  }) => {
    await signupPage.open();
    await signupPage.register(freshUser);
    await verificationPage.expectLoaded(freshUser.email);

    await verificationPage.verify('000000');
    await verificationPage.expectInvalidCodeError();
  });
});
