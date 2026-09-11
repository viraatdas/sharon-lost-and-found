export type SendResult = { delivered: true } | { delivered: false; reason: string };

const TERMINAL_STATUSES = new Set(['delivered', 'sent', 'undelivered', 'failed']);

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
  for (let attempt = 0; attempt < 6; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const statusResponse = await fetch(statusUrl, { headers: { Authorization: auth } });
    if (!statusResponse.ok) continue;
    const status = await statusResponse.json() as { status: string; error_code: number | null; error_message: string | null };
    if (!TERMINAL_STATUSES.has(status.status)) continue;
    if (status.status === 'undelivered' || status.status === 'failed') return { delivered: false, reason: friendlyReason(status.error_code, status.error_message) };
    return { delivered: true };
  }
  return { delivered: false, reason: 'Still trying to deliver the text — it may arrive shortly.' };
}
