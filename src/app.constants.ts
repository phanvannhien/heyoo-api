
import { config } from 'dotenv';
import { Logger } from '@nestjs/common';

try {
  config();
} catch (e) {
  Logger.error(`.env file doens't exist please add it.`);
}


export const TWILIO_ACCOUNT_SID       = process.env.TWILIO_ACCOUNT_SID
export const TWILIO_AUTH_TOKEN        = process.env.TWILIO_AUTH_TOKEN
export const TWILIO_VERIFY_SID        = process.env.TWILIO_VERIFY_SID
export const TWILIO_FROM_PHONE        = process.env.TWILIO_FROM_PHONE
export const MONGO_URI = process.env.MONGO_URI
export const PORT = process.env.PORT
