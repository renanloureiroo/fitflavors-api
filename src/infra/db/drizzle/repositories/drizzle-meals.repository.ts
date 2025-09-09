import { Meal, MealStatusEnum } from '@/domain/meals/entities/meal';
import { MealsRepository } from '@/domain/meals/repositories/meals.repository';

import { db } from '..';
import { eq, and, gte, lt } from 'drizzle-orm';
import { DrizzleMealMapper } from '../mapper/drizzle-meal.mapper';
import { meals } from '../schema';

export class DrizzleMealsRepository implements MealsRepository {
  async findById(id: string): Promise<Meal | null> {
    const meal = (await db.select().from(meals).where(eq(meals.id, id))).at(0);

    return meal ? DrizzleMealMapper.toDomain(meal) : null;
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
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    const result = (
      await db
        .select()
        .from(meals)
        .where(
          and(
            eq(meals.userId, userId),
            eq(meals.status, status),
            gte(meals.createdAt, startDate),
            lt(meals.createdAt, endDate)
          )
        )
    ).map(DrizzleMealMapper.toDomain);

    return result;
  }

  async findByIdAndUserId(id: string, userId: string): Promise<Meal | null> {
    const meal = (
      await db
        .select()
        .from(meals)
        .where(and(eq(meals.id, id), eq(meals.userId, userId)))
    ).at(0);

    return meal ? DrizzleMealMapper.toDomain(meal) : null;
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
}
