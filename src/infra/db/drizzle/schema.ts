import {
  date,
  integer,
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

  // GOALS
  calories: integer().notNull(),
  proteins: integer().notNull(),
  carbohydrates: integer().notNull(),
  fats: integer().notNull(),

  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
});
