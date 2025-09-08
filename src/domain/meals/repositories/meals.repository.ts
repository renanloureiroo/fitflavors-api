import { Meal } from '../entities/meal';

export interface MealsRepository {
  save(meal: Meal): Promise<Meal>;
  findById(id: string): Promise<Meal | null>;
  findByUserId(userId: string): Promise<Meal[]>;
  findByUserIdAndDate(userId: string, date: string): Promise<Meal[]>;
}
