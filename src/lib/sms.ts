export type SendResult = { delivered: true } | { delivered: false; reason: string };

const FAILURE_STATUSES = new Set(['undelivered', 'failed']);

function friendlyReason(errorCode: number | null, errorMessage: string | null): string {
  if (errorCode === 30032 || errorCode === 30034) return 'Texting isn’t fully turned on yet — the sending number is still being verified with carriers.';
  return errorMessage || 'The text could not be delivered. Please check the number and try again.';
}

export async function sendSms(phone: string, message: string): Promise<SendResult> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const apiKeySid = process.env.TWILIO_API_KEY_SID;
  const apiKeySecret = process.env.TWILIO_API_KEY_SECRET;
  const from = process.env.TWILIO_FROM_NUMBER;
  if (!accountSid || !apiKeySid || !apiKeySecret || !from) return { delivered: false, reason: 'SMS is not connected yet.' };

  const auth = 'Basic ' + Buffer.from(`${apiKeySid}:${apiKeySecret}`).toString('base64');
  const createResponse = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: 'POST',
    headers: { Authorization: auth, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ To: phone, From: from, Body: message }),
  });
  if (!createResponse.ok) {
    const body = await createResponse.json().catch(() => null);
    return { delivered: false, reason: friendlyReason(body?.code ?? null, body?.message ?? null) };
  }
  const created = await createResponse.json() as { sid: string };

  const statusUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages/${created.sid}.json`;
  for (let attempt = 0; attempt < 12; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const statusResponse = await fetch(statusUrl, { headers: { Authorization: auth } });
    if (!statusResponse.ok) continue;
    const status = await statusResponse.json() as { status: string; error_code: number | null; error_message: string | null };
    if (status.status === 'delivered') return { delivered: true };
    if (FAILURE_STATUSES.has(status.status)) return { delivered: false, reason: friendlyReason(status.error_code, status.error_message) };
    // still queued/sending/sent — a carrier can flip "sent" to "undelivered" after the fact, so keep waiting for a real terminal state.
  }
  return { delivered: false, reason: 'Sent, but delivery hasn’t been confirmed yet — it may still arrive.' };
}
