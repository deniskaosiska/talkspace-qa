export const Urls = {
  signupPath: '/signup/autoswitchpt',
  emailVerificationOtpPath: '/email-verification/otp',
  emailVerificationSentPath: '/email-verification/sent',
  emailVerificationPattern: /\/email-verification/,
} as const;

export const SignupCopy = {
  pageHeading: 'Create your account',
  createAccountButton: 'Create account',
} as const;

export const VerificationCopy = {
  verifyPrompt: 'Before matching with a provider, verify your email',
  otpSentPrefix: 'We sent a one-time code to',
  linkSentPrefix: 'We sent an email with a verification link to',
  resendCode: 'Resend code',
} as const;
