import { PinpointSMSVoiceV2Client, SendTextMessageCommand } from '@aws-sdk/client-pinpoint-sms-voice-v2';

export type SendResult = { delivered: true } | { delivered: false; reason: string };

export async function sendSms(phone: string, message: string): Promise<SendResult> {
  const accessKeyId = process.env.SMS_AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.SMS_AWS_SECRET_ACCESS_KEY;
  const originationIdentity = process.env.SMS_ORIGINATION_IDENTITY;
  const region = process.env.SMS_AWS_REGION || 'us-east-1';
  if (!accessKeyId || !secretAccessKey || !originationIdentity) return { delivered: false, reason: 'SMS is not connected yet.' };

  const client = new PinpointSMSVoiceV2Client({ region, credentials: { accessKeyId, secretAccessKey } });
  try {
    await client.send(new SendTextMessageCommand({
      DestinationPhoneNumber: phone,
      OriginationIdentity: originationIdentity,
      MessageBody: message,
      MessageType: 'TRANSACTIONAL',
    }));
    return { delivered: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    const reason = message.includes('RESOURCE_NOT_ACTIVE')
      ? 'Texting isn’t fully turned on yet — the sending number is still being verified with carriers.'
      : message || 'The text could not be sent.';
    return { delivered: false, reason };
  }
}
