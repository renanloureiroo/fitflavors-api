import { Meal } from '../entities/meal';

export class MealPresenter {
  static toHTTP(raw: Meal) {
    return {
      id: raw.id.toValue(),
      name: raw.name,
      icon: raw.icon,
      userId: raw.userId.toValue(),
      status: raw.status,
      inputType: raw.inputType,
      inputFileKey: raw.inputFileKey,
      foods: raw.foods,
      createdAt: raw.createdAt,
    };
  }
}
