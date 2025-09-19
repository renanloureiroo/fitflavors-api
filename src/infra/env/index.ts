import 'dotenv/config';
import z from 'zod';

const schema = z.object({
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string(),
  ENCRYPT_SALTS: z.string(),
  // AWS S3 Configuration
  AWS_S3_BUCKET_NAME: z.string().optional(),
  // AWS SQS Configuration
  AWS_SQS_MEALS_QUEUE_URL: z.string().optional(),
  // WhatsApp Configuration
  WHATSAPP_API_URL: z
    .string()
    .url()
    .default('https://graph.facebook.com/v21.0'),
  WHATSAPP_ACCESS_TOKEN: z
    .string()
    .min(1, 'WHATSAPP_ACCESS_TOKEN é obrigatório'),
  WHATSAPP_PHONE_NUMBER_ID: z
    .string()
    .min(1, 'WHATSAPP_PHONE_NUMBER_ID é obrigatório'),
  WHATSAPP_OTP_TEMPLATE_NAME: z.string().default('fitflavors_otp_verification'),
});

export const env = schema.parse(process.env);
