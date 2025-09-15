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
    const result = await db
      .insert(meals)
      .values(DrizzleMealMapper.toPersistence(meal))
      .returning();

    const savedMeal = result.at(0);
    if (!savedMeal) {
      throw new Error('Failed to save meal - no record returned');
    }

    return DrizzleMealMapper.toDomain(savedMeal);
  }

  async update(meal: Meal): Promise<Meal> {
    const persistence = DrizzleMealMapper.toPersistence(meal);
    console.log('persistence', persistence);

    const result = await db
      .update(meals)
      .set(persistence)
      .where(eq(meals.id, meal.id.toValue()))
      .returning();

    console.log('update result:', result);

    const updatedMeal = result.at(0);
    if (!updatedMeal) {
      throw new Error(`Meal with id ${meal.id.toValue()} not found for update`);
    }

    return DrizzleMealMapper.toDomain(updatedMeal);
  }

  async delete(id: string): Promise<void> {
    await db.delete(meals).where(eq(meals.id, id));
  }
}
