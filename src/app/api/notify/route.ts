import { NextResponse } from 'next/server';
import { sendSms } from '@/lib/sms';

export async function POST(request: Request) {
  const { phone, item } = await request.json() as { phone?: string; item?: string };
  if (!phone || !item) return NextResponse.json({ error: 'A phone number and item are required.' }, { status: 400 });

  const result = await sendSms(phone, `Hi! Someone at Sharon Lost + Found thinks the ${item} might be yours. Take a look: https://sharonlostandfound.viraat.dev`);
  return NextResponse.json(result);
}
