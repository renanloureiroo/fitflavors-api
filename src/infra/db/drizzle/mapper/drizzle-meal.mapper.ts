import {
  InputTypeEnum,
  Meal,
  MealStatusEnum,
} from '@/domain/meals/entities/meal';
import { meals } from '../schema';
import { UniqueEntityId } from '@/core/unique-entity-id';

type DrizzleMeal = typeof meals.$inferSelect;

export class DrizzleMealMapper {
  static toDomain(raw: DrizzleMeal): Meal {
    return Meal.create({
      name: raw.name,
      icon: raw.icon,
      userId: new UniqueEntityId(raw.userId),
      status: raw.status as MealStatusEnum,
      inputType: raw.inputType as InputTypeEnum,
      inputFileKey: raw.inputFileKey,
      foods: raw.foods as Array<unknown>,

      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toPersistence(meal: Meal): DrizzleMeal {
    return {
      id: meal.id.toValue(),
      name: meal.name,
      icon: meal.icon,
      userId: meal.userId.toValue(),
      status: meal.status,
      inputType: meal.inputType,
      inputFileKey: meal.inputFileKey,
      foods: meal.foods as Array<unknown>,
      createdAt: meal.createdAt,
      updatedAt: meal.updatedAt,
    };
  }
}
