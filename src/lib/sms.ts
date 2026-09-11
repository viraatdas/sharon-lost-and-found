import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

export type SendResult = { delivered: true } | { delivered: false; reason: string };

export async function sendSms(phone: string, message: string): Promise<SendResult> {
  const accessKeyId = process.env.SMS_AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.SMS_AWS_SECRET_ACCESS_KEY;
  const region = process.env.SMS_AWS_REGION || 'us-east-1';
  if (!accessKeyId || !secretAccessKey) return { delivered: false, reason: 'SMS is not connected yet.' };

  const client = new SNSClient({ region, credentials: { accessKeyId, secretAccessKey } });
  try {
    await client.send(new PublishCommand({
      PhoneNumber: phone,
      Message: message,
      MessageAttributes: {
        'AWS.SNS.SMS.SMSType': { DataType: 'String', StringValue: 'Transactional' },
      },
    }));
    return { delivered: true };
  } catch {
    return { delivered: false, reason: 'The text could not be sent. Please check the number and try again.' };
  }
}
