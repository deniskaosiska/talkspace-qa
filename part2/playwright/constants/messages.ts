export const SignupMessages = {
  emailRequired: 'Please enter an email.',
  passwordRequired: 'Please enter a password.',
  nicknameRequired: 'Please enter a nickname.',
  stateRequired: 'Please select a state.',
  passwordMinLength: 'Password must be at least 8 characters.',
} as const;

export const VerificationMessages = {
  invalidOtp: 'Error validating OTP',
} as const;
