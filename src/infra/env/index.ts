import 'dotenv/config';
import z from 'zod';

const schema = z.object({
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string(),
  ENCRYPT_SALTS: z.string(),
  // AWS S3 Configuration
  AWS_S3_BUCKET_NAME: z.string().optional(),
});

export const env = schema.parse(process.env);
