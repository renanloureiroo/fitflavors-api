import 'dotenv/config';
import z from 'zod';

const schema = z.object({
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string(),
  ENCRYPT_SALTS: z.string(),
});

export const env = schema.parse(process.env);
