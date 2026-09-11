import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { phone, item } = await request.json() as { phone?: string; item?: string };
  if (!phone || !item) return NextResponse.json({ error: 'A phone number and item are required.' }, { status: 400 });

  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;
  if (!sid || !token || !from) {
    return NextResponse.json({ delivered: false, reason: 'SMS is not connected yet.' });
  }

  const body = new URLSearchParams({
    To: phone,
    From: from,
    Body: `Hi! Someone at Sharon Lost + Found thinks the ${item} might be yours. Take a look: https://sharonlostandfound.viraat.dev`,
  });
  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: 'POST',
    headers: { Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString('base64')}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!response.ok) return NextResponse.json({ error: 'The text could not be sent. Please check the number and try again.' }, { status: 502 });
  return NextResponse.json({ delivered: true });
}
