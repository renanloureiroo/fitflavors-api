import { Meal, MealStatusEnum } from '@/domain/meals/entities/meal';
import { MealsRepository } from '@/domain/meals/repositories/meals.repository';

import { db } from '..';
import { eq, and, gt, lt } from 'drizzle-orm';
import { DrizzleMealMapper } from '../mapper/drizzle-meal.mapper';
import { meals } from '../schema';
import { startOfDayUTC, endOfDayUTC } from '@/core/utils/date-utils';

export class DrizzleMealsRepository implements MealsRepository {
  async findByInputFileKey(fileKey: string): Promise<Meal | null> {
    const result = await db
      .select()
      .from(meals)
      .where(eq(meals.inputFileKey, fileKey));
    const meal = result.at(0);

    if (!meal) {
      return null;
    }

    return DrizzleMealMapper.toDomain(meal);
  }
  async findById(id: string): Promise<Meal | null> {
    const result = await db.select().from(meals).where(eq(meals.id, id));
    const meal = result.at(0);

    if (!meal) {
      return null;
    }

    return DrizzleMealMapper.toDomain(meal);
  }
  async findByUserId(userId: string): Promise<Meal[]> {
    const result = (
      await db.select().from(meals).where(eq(meals.userId, userId))
    ).map(DrizzleMealMapper.toDomain);

    return result;
  }
  async findByUserIdAndDateAndStatus(
    userId: string,
    date: string,
    status: MealStatusEnum
  ): Promise<Meal[]> {
    const startDate = startOfDayUTC(date);
    const endDate = endOfDayUTC(date);

    const result = (
      await db
        .select()
        .from(meals)
        .where(
          and(
            eq(meals.userId, userId),
            eq(meals.status, status),
            gt(meals.createdAt, startDate),
            lt(meals.createdAt, endDate)
          )
        )
    ).map(DrizzleMealMapper.toDomain);

    return result;
  }

  async findByIdAndUserId(id: string, userId: string): Promise<Meal | null> {
    const result = await db
      .select()
      .from(meals)
      .where(and(eq(meals.id, id), eq(meals.userId, userId)));
    const meal = result.at(0);

    if (!meal) {
      return null;
    }

    return DrizzleMealMapper.toDomain(meal);
  }

  async save(meal: Meal): Promise<Meal> {
    const result = (
      await db
        .insert(meals)
        .values(DrizzleMealMapper.toPersistence(meal))
        .returning()
    ).at(0);

    return DrizzleMealMapper.toDomain(result!);
  }

  async update(meal: Meal): Promise<Meal> {
    const result = await db
      .update(meals)
      .set(DrizzleMealMapper.toPersistence(meal))
      .where(eq(meals.id, meal.id.toValue()))
      .returning();

    return DrizzleMealMapper.toDomain(result.at(0)!);
  }
}
