import { expect } from '@playwright/test';

const MAILINATOR_BASE = 'https://mailinator.com/api/v2/domains/public';
const OTP_TIMEOUT_MS = Number(process.env.OTP_TIMEOUT_MS ?? 120_000);
const OTP_POLL_INTERVAL_MS = Number(process.env.OTP_POLL_INTERVAL_MS ?? 5_000);

type InboxMessage = {
  id: string;
  subject?: string;
  from?: string;
};

function inboxNameFromEmail(email: string): string {
  return email.split('@')[0] ?? email;
}

function isTalkspaceVerificationMessage(msg: InboxMessage): boolean {
  const subject = msg.subject?.toLowerCase() ?? '';
  const from = msg.from?.toLowerCase() ?? '';

  return (
    subject.includes('verify') ||
    subject.includes('verification') ||
    from.includes('talkspace')
  );
}

async function fetchVerificationMessageId(inbox: string): Promise<string | null> {
  const response = await fetch(`${MAILINATOR_BASE}/inboxes/${inbox}`);
  if (!response.ok) return null;

  const payload = (await response.json()) as { msgs?: InboxMessage[] };
  const talkspaceMsg = payload.msgs?.find(isTalkspaceVerificationMessage);

  return talkspaceMsg?.id ?? null;
}

async function fetchMessageBody(messageId: string): Promise<string> {
  const response = await fetch(`${MAILINATOR_BASE}/messages/${messageId}`);
  if (!response.ok) {
    throw new Error(`Mailinator message fetch failed: ${response.status}`);
  }

  const payload = (await response.json()) as {
    parts?: Array<{ body?: string }>;
  };

  return payload.parts?.map((part) => part.body ?? '').join('\n') ?? '';
}

function extractOtp(body: string): string | null {
  const normalized = body.replace(/\s+/g, ' ');

  const contextualPatterns = [
    /verification code[^\d]{0,40}(\d{6})/i,
    /one-time code[^\d]{0,40}(\d{6})/i,
    /your code[^\d]{0,40}(\d{6})/i,
    /code[^\d]{0,20}(\d{6})/i,
  ];

  for (const pattern of contextualPatterns) {
    const match = normalized.match(pattern);
    if (match?.[1]) return match[1];
  }

  if (!/verify|verification|talkspace|one-time code/i.test(normalized)) {
    return null;
  }

  const fallback = normalized.match(/\b(\d{6})\b/);
  return fallback?.[1] ?? null;
}

async function tryFetchOtp(email: string): Promise<string | null> {
  const inbox = inboxNameFromEmail(email);
  const messageId = await fetchVerificationMessageId(inbox);
  if (!messageId) return null;

  const body = await fetchMessageBody(messageId);
  return extractOtp(body);
}

export async function fetchVerificationCode(email: string): Promise<string> {
  let otp: string | null = null;

  await expect
    .poll(
      async () => {
        otp = await tryFetchOtp(email);
        return otp;
      },
      {
        timeout: OTP_TIMEOUT_MS,
        intervals: [OTP_POLL_INTERVAL_MS],
      },
    )
    .toMatch(/^\d{6}$/);

  return otp!;
}
