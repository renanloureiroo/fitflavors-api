import { Gender, Goal, User } from '@/domain/users/entities/user';
import { users } from '../schema';
import { UniqueEntityId } from '@/core/unique-entity-id';

type DrizzleUser = typeof users.$inferSelect;

export class DrizzleMapper {
  static toDomain(raw: DrizzleUser): User {
    return User.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        gender: raw.gender as Gender,
        goal: raw.goal as Goal,
        birthDate: new Date(raw.birthDate),
        height: raw.height,
        weight: raw.weight,
        activityLevel: raw.activityLevel,
        calories: raw.calories,
        proteins: raw.proteins,
        carbohydrates: raw.carbohydrates,
        fats: raw.fats,
      },
      new UniqueEntityId(raw.id)
    );
  }

  static toDrizzle(user: User): DrizzleUser {
    return {
      id: user.id.toValue(),
      name: user.name,
      email: user.email,
      password: user.password,
      goal: user.goal,
      gender: user.gender,
      birthDate: user.birthDate.toISOString(),
      height: user.height,
      weight: user.weight,
      activityLevel: user.activityLevel,
      calories: user.calories,
      proteins: user.proteins,
      carbohydrates: user.carbohydrates,
      fats: user.fats,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
