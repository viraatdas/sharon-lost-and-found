import { NextResponse } from 'next/server';
import { PinpointSMSVoiceV2Client, SendTextMessageCommand } from '@aws-sdk/client-pinpoint-sms-voice-v2';

export async function POST(request: Request) {
  const { phone, item } = await request.json() as { phone?: string; item?: string };
  if (!phone || !item) return NextResponse.json({ error: 'A phone number and item are required.' }, { status: 400 });

  const accessKeyId = process.env.SMS_AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.SMS_AWS_SECRET_ACCESS_KEY;
  const originationNumber = process.env.SMS_ORIGINATION_NUMBER;
  const region = process.env.SMS_AWS_REGION || 'us-east-1';
  if (!accessKeyId || !secretAccessKey || !originationNumber) {
    return NextResponse.json({ delivered: false, reason: 'SMS is not connected yet.' });
  }

  const client = new PinpointSMSVoiceV2Client({ region, credentials: { accessKeyId, secretAccessKey } });
  try {
    await client.send(new SendTextMessageCommand({
      DestinationPhoneNumber: phone,
      OriginationIdentity: originationNumber,
      MessageBody: `Hi! Someone at Sharon Lost + Found thinks the ${item} might be yours. Take a look: https://sharonlostandfound.viraat.dev`,
      MessageType: 'TRANSACTIONAL',
    }));
    return NextResponse.json({ delivered: true });
  } catch {
    return NextResponse.json({ error: 'The text could not be sent. Please check the number and try again.' }, { status: 502 });
  }
}
