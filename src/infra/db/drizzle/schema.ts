import {
  boolean,
  date,
  integer,
  json,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  goal: varchar({ length: 8 }).notNull(),
  gender: varchar({ length: 6 }).notNull(),
  birthDate: date('birth_date').notNull(),
  height: integer().notNull(),
  weight: integer().notNull(),
  activityLevel: integer('activity_level').notNull(),

  // WHATSAPP
  countryCode: varchar('country_code', { length: 4 }),
  areaCode: varchar('area_code', { length: 2 }),
  phoneNumber: varchar('phone_number', { length: 9 }),
  phoneVerified: boolean('phone_verified').notNull().default(false),

  // GOALS
  calories: integer().notNull(),
  proteins: integer().notNull(),
  carbohydrates: integer().notNull(),
  fats: integer().notNull(),

  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull(),
});

export const mealsStatus = pgEnum('meals_status', [
  'uploading',
  'processing',
  'success',
  'failed',
]);

export const mealInputTypes = pgEnum('input_types', ['audio', 'picture']);

export const meals = pgTable('meals', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  status: mealsStatus().notNull(),
  inputType: mealInputTypes('input_type').notNull(),
  inputFileKey: varchar('input_file_key', { length: 255 }).notNull(),
  name: varchar({ length: 255 }),
  icon: varchar({ length: 255 }),
  foods: json(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull(),
});

export const otpVerifications = pgTable('otp_verifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  countryCode: varchar('country_code', { length: 4 }).notNull(),
  areaCode: varchar('area_code', { length: 2 }).notNull(),
  phoneNumber: varchar('phone_number', { length: 9 }).notNull(),
  code: varchar('code', { length: 6 }).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  verified: boolean('verified').notNull().default(false),
  attempts: integer('attempts').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull(),
});
