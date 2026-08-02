export const Urls = {
  signupPath: '/signup/autoswitchpt',
  emailVerificationPath: '/email-verification/otp',
  emailVerificationPattern: /\/email-verification/,
} as const;

export const SignupCopy = {
  pageHeading: 'Create your account',
  createAccountButton: 'Create account',
} as const;

export const VerificationCopy = {
  verifyPrompt: 'Before matching with a provider, verify your email',
  codeSentPrefix: 'We sent a one-time code to',
  resendCode: 'Resend code',
} as const;
