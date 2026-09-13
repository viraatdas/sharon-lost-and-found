import { NextResponse } from 'next/server';
import { sendSms } from '@/lib/sms';

const MEDIA_BASE_URL = 'https://sharon-lost-and-found-media-597088032164.s3.amazonaws.com';

export async function POST(request: Request) {
  const { phone, item, image } = await request.json() as { phone?: string; item?: string; image?: string };
  if (!phone || !item) return NextResponse.json({ error: 'A phone number and item are required.' }, { status: 400 });

  const mediaUrl = image && /^\/finds\/[\w.-]+$/.test(image) ? `${MEDIA_BASE_URL}${image}` : undefined;
  const result = await sendSms(phone, `Hi! Someone at Sharon Lost + Found thinks the ${item} might be yours. Take a look: https://sharonlostandfound.viraat.dev`, mediaUrl);
  return NextResponse.json(result);
}
