import { env } from '@/infra/db/env';
import { drizzle } from 'drizzle-orm/neon-http';

export const db = drizzle(env.DATABASE_URL);
