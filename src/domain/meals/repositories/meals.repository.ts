import { Meal, MealStatusEnum } from '../entities/meal';

export interface MealsRepository {
  save(meal: Meal): Promise<Meal>;
  findById(id: string): Promise<Meal | null>;
  findByUserId(userId: string): Promise<Meal[]>;
  findByUserIdAndDateAndStatus(
    userId: string,
    date: string,
    status: MealStatusEnum
  ): Promise<Meal[]>;
  findByIdAndUserId(id: string, userId: string): Promise<Meal | null>;
}
