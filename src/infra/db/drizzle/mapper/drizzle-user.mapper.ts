import { Gender, Goal, User } from '@/domain/users/entities/user';
import { users } from '../schema';
import { UniqueEntityId } from '@/core/unique-entity-id';
import { toUTC } from '@/core/utils/date-utils';

type DrizzleUser = typeof users.$inferSelect;

export class DrizzleUserMapper {
  static toDomain(raw: DrizzleUser): User {
    const userData: {
      name: string;
      email: string;
      password: string;
      gender: Gender;
      goal: Goal;
      birthDate: Date;
      height: number;
      weight: number;
      activityLevel: number;
      countryCode?: string;
      areaCode?: string;
      phoneNumber?: string;
      phoneVerified: boolean;
      calories: number;
      proteins: number;
      carbohydrates: number;
      fats: number;
    } = {
      name: raw.name,
      email: raw.email,
      password: raw.password,
      gender: raw.gender as Gender,
      goal: raw.goal as Goal,
      birthDate: toUTC(new Date(raw.birthDate)),
      height: raw.height,
      weight: raw.weight,
      activityLevel: raw.activityLevel,
      phoneVerified: raw.phoneVerified,
      calories: raw.calories,
      proteins: raw.proteins,
      carbohydrates: raw.carbohydrates,
      fats: raw.fats,
    };

    if (raw.countryCode) {
      userData.countryCode = raw.countryCode;
    }

    if (raw.areaCode) {
      userData.areaCode = raw.areaCode;
    }

    if (raw.phoneNumber) {
      userData.phoneNumber = raw.phoneNumber;
    }

    return User.create(userData, new UniqueEntityId(raw.id));
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
      countryCode: user.countryCode || null,
      areaCode: user.areaCode || null,
      phoneNumber: user.phoneNumber || null,
      phoneVerified: user.phoneVerified,
      calories: user.calories,
      proteins: user.proteins,
      carbohydrates: user.carbohydrates,
      fats: user.fats,
      createdAt: toUTC(user.createdAt),
      updatedAt: toUTC(user.updatedAt),
    };
  }
}
