import * as dotenv from 'dotenv';
import * as Twilio from 'twilio';

dotenv.config();

const twilioClient = Twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

export const sendSMS = (to: string, body: string) =>
  twilioClient.messages.create({
    to,
    body,
    from: process.env.TWILIO_PHONE,
  });

export const sendVerificationSMS = (to: string, key: string) =>
  sendSMS(to, `Your verification key is ${key}`);
