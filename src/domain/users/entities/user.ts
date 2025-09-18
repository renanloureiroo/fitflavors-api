import { Entity } from '@/core/entitiy';
import { Optional } from '@/core/optional';
import { UniqueEntityId } from '@/core/unique-entity-id';
import { nowUTC } from '@/core/utils/date-utils';

export type Gender = 'male' | 'female';

export type Goal = 'lose' | 'maintain' | 'gain';

export enum ActivityLevelEnum {
  VERY_LOW = 1,
  LOW = 2,
  MEDIUM = 3,
  HIGH = 4,
  VERY_HIGH = 5,
}

export type UserProps = {
  name: string;
  email: string;
  password: string;
  gender: Gender;
  goal: Goal;
  birthDate: Date;
  height: number;
  weight: number;
  activityLevel: ActivityLevelEnum;
  countryCode: string | null;
  areaCode: string | null;
  phoneNumber: string | null;
  phoneVerified: boolean;
  calories: number;
  proteins: number;
  carbohydrates: number;
  fats: number;
  createdAt: Date;
  updatedAt: Date;
};

class User extends Entity<UserProps> {
  static create(
    data: Optional<
      UserProps,
      | 'areaCode'
      | 'phoneNumber'
      | 'countryCode'
      | 'phoneVerified'
      | 'calories'
      | 'proteins'
      | 'carbohydrates'
      | 'fats'
      | 'createdAt'
      | 'updatedAt'
    >,
    id?: UniqueEntityId
  ): User {
    return new User(
      {
        ...data,
        areaCode: data.areaCode ?? null,
        phoneNumber: data.phoneNumber ?? null,
        countryCode: data.countryCode ?? null,
        phoneVerified: data.phoneVerified ?? false,
        calories: data.calories ?? 0,
        proteins: data.proteins ?? 0,
        carbohydrates: data.carbohydrates ?? 0,
        fats: data.fats ?? 0,
        createdAt: data.createdAt ?? nowUTC(),
        updatedAt: data.updatedAt ?? nowUTC(),
      },
      id ?? new UniqueEntityId()
    );
  }

  get name() {
    return this.props.name;
  }

  set name(value: string) {
    this.props.name = value;
    this.touch();
  }

  get email() {
    return this.props.email;
  }

  set email(value: string) {
    this.props.email = value;
    this.touch();
  }

  get password() {
    return this.props.password;
  }

  set password(value: string) {
    this.props.password = value;
    this.touch();
  }

  get gender() {
    return this.props.gender;
  }

  set gender(value: Gender) {
    this.props.gender = value;
    this.touch();
  }

  get goal() {
    return this.props.goal;
  }

  set goal(value: Goal) {
    this.props.goal = value;
    this.touch();
  }

  get birthDate() {
    return this.props.birthDate;
  }

  get countryCode() {
    return this.props.countryCode;
  }

  set countryCode(value: string | null) {
    this.props.countryCode = value;

    this.touch();
  }

  get areaCode() {
    return this.props.areaCode;
  }

  set areaCode(value: string | null) {
    this.props.areaCode = value;

    this.touch();
  }

  get phoneNumber() {
    return this.props.phoneNumber;
  }

  set phoneNumber(value: string | null) {
    this.props.phoneNumber = value;

    this.touch();
  }

  // Método para obter o número completo no formato internacional
  get fullPhoneNumber(): string | undefined {
    if (
      !this.props.countryCode ||
      !this.props.areaCode ||
      !this.props.phoneNumber
    ) {
      return undefined;
    }
    return `+${this.props.countryCode}${this.props.areaCode}${this.props.phoneNumber}`;
  }

  get phoneVerified() {
    return this.props.phoneVerified;
  }

  set phoneVerified(value: boolean) {
    this.props.phoneVerified = value;
    this.touch();
  }

  get height() {
    return this.props.height;
  }

  set height(value: number) {
    this.props.height = value;
    this.touch();
  }

  get weight() {
    return this.props.weight;
  }

  set weight(value: number) {
    this.props.weight = value;
    this.touch();
  }

  get activityLevel() {
    return this.props.activityLevel;
  }

  set activityLevel(value: ActivityLevelEnum) {
    this.props.activityLevel = value;
    this.touch();
  }

  get calories() {
    return this.props.calories;
  }

  set calories(value: number) {
    this.props.calories = value;
    this.touch();
  }

  get proteins() {
    return this.props.proteins;
  }

  set proteins(value: number) {
    this.props.proteins = value;
    this.touch();
  }

  get carbohydrates() {
    return this.props.carbohydrates;
  }

  set carbohydrates(value: number) {
    this.props.carbohydrates = value;
    this.touch();
  }

  get fats() {
    return this.props.fats;
  }

  set fats(value: number) {
    this.props.fats = value;
    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = nowUTC();
  }
}

export { User };
