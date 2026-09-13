import { PinpointSMSVoiceV2Client, SendTextMessageCommand, SendMediaMessageCommand } from '@aws-sdk/client-pinpoint-sms-voice-v2';

export type SendResult = { delivered: true } | { delivered: false; reason: string };

function friendlyReason(error: unknown): string {
  const message = error instanceof Error ? error.message : '';
  if (message.includes('RESOURCE_NOT_ACTIVE')) return 'Texting isn’t fully turned on yet — the sending number is still being verified with carriers.';
  return message || 'The text could not be sent.';
}

export async function sendSms(phone: string, message: string, mediaUrl?: string): Promise<SendResult> {
  const accessKeyId = process.env.SMS_AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.SMS_AWS_SECRET_ACCESS_KEY;
  const originationIdentity = process.env.SMS_ORIGINATION_IDENTITY;
  const region = process.env.SMS_AWS_REGION || 'us-east-1';
  if (!accessKeyId || !secretAccessKey || !originationIdentity) return { delivered: false, reason: 'SMS is not connected yet.' };

  const client = new PinpointSMSVoiceV2Client({ region, credentials: { accessKeyId, secretAccessKey } });
  try {
    if (mediaUrl) {
      await client.send(new SendMediaMessageCommand({
        DestinationPhoneNumber: phone,
        OriginationIdentity: originationIdentity,
        MessageBody: message,
        MediaUrls: [mediaUrl],
      }));
    } else {
      await client.send(new SendTextMessageCommand({
        DestinationPhoneNumber: phone,
        OriginationIdentity: originationIdentity,
        MessageBody: message,
        MessageType: 'TRANSACTIONAL',
      }));
    }
    return { delivered: true };
  } catch (error) {
    return { delivered: false, reason: friendlyReason(error) };
  }
}
