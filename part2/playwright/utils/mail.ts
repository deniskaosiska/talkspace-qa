import { Timeouts } from '../constants/timeouts';
import { pollUntil } from './wait';

const MAILINATOR_BASE = 'https://mailinator.com/api/v2/domains/public';
const OTP_REGEX = /\b(\d{6})\b/;

function inboxNameFromEmail(email: string): string {
  return email.split('@')[0] ?? email;
}

async function fetchLatestMessageId(inbox: string): Promise<string | null> {
  const response = await fetch(`${MAILINATOR_BASE}/inboxes/${inbox}`);
  if (!response.ok) return null;

  const payload = (await response.json()) as {
    msgs?: Array<{ id: string; subject?: string; from?: string }>;
  };

  const talkspaceMsg = payload.msgs?.find(
    (msg) =>
      msg.subject?.toLowerCase().includes('verify') ||
      msg.from?.toLowerCase().includes('talkspace'),
  );

  return talkspaceMsg?.id ?? payload.msgs?.[0]?.id ?? null;
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
  const match = body.match(OTP_REGEX);
  return match?.[1] ?? null;
}

export async function fetchVerificationCode(email: string): Promise<string> {
  const inbox = inboxNameFromEmail(email);

  return pollUntil(
    async () => {
      const messageId = await fetchLatestMessageId(inbox);
      if (!messageId) return null;

      const body = await fetchMessageBody(messageId);
      return extractOtp(body);
    },
    {
      timeoutMs: Timeouts.otpTimeoutMs,
      intervalMs: Timeouts.otpPollIntervalMs,
      label: `verification email for ${email}`,
    },
  );
}
