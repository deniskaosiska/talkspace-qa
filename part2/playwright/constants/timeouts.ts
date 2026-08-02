export const Timeouts = {
  otpTimeoutMs: Number(process.env.OTP_TIMEOUT_MS ?? 120_000),
  otpPollIntervalMs: Number(process.env.OTP_POLL_INTERVAL_MS ?? 5_000),
  spaSettleMs: 3_000,
  postSubmitMs: 15_000,
} as const;
