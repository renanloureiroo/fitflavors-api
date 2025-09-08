import { ActivityLevelEnum, Gender, Goal } from '../entities/user';

export type CalculateGoalsParams = {
  height: number;
  weight: number;
  gender: Gender;
  birthDate: Date;
  activityLevel: ActivityLevelEnum;
  goal: Goal;
};

const activityMultipliers = {
  1: 1.2,
  2: 1.375,
  3: 1.55,
  4: 1.725,
  5: 1.9,
} as const;

export class CalculateGoalService {
  public calculateGoals(params: CalculateGoalsParams) {
    const { weight } = params;
    const calories = this.calculateCalories(params);

    const proteinGrams = Math.round(weight * 2);
    const fatGrams = Math.round(weight * 0.9);
    const carbsGrams = Math.round(
      (calories - proteinGrams * 4 - fatGrams * 9) / 4
    );

    return {
      calories: proteinGrams * 4 + fatGrams * 9 + carbsGrams * 4,
      proteins: proteinGrams,
      carbohydrates: carbsGrams,
      fats: fatGrams,
    };
  }

  private calculateCalories(params: CalculateGoalsParams) {
    const { activityLevel, birthDate, gender, goal, height, weight } = params;
    const age = new Date().getFullYear() - birthDate.getFullYear();

    const bmr =
      gender === 'male'
        ? 88.36 + 13.4 * weight + 4.8 * height - 5.7 * age
        : 447.6 + 9.2 * weight + 3.1 * height - 4.3 * age;

    const tdee =
      bmr *
      activityMultipliers[activityLevel as keyof typeof activityMultipliers];

    if (goal === 'maintain') {
      return Math.round(tdee);
    }

    if (goal === 'gain') {
      return Math.round(tdee + 500);
    }

    return Math.round(tdee - 500);
  }
}
