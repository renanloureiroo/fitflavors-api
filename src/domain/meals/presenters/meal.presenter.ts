import { MealResponseDTO } from '../dtos/meal-response.dto';
import { Meal } from '../entities/meal';

export class MealPresenter {
  static toHTTP(raw: Meal): MealResponseDTO {
    return {
      id: raw.id.toValue(),
      name: raw.name,
      icon: raw.icon,
      status: raw.status,
      foods: raw.foods,
      createdAt: raw.createdAt.toISOString(),
    };
  }
}
