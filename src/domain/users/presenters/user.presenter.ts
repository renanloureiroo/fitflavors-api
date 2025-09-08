import { User } from '../entities/user';

export class UserPresenter {
  static toHTTP(raw: User) {
    return {
      id: raw.id.toValue(),
      name: raw.name,
      email: raw.email,
      gender: raw.gender,
      goal: raw.goal,
      birthDate: raw.birthDate.toISOString(),
      height: raw.height,
      weight: raw.weight,
      activityLevel: raw.activityLevel,
      calories: raw.calories,
      proteins: raw.proteins,
      carbohydrates: raw.carbohydrates,
      fats: raw.fats,
    };
  }
}
