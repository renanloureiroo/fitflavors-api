import { Entity } from '@/core/entitiy';
import { Optional } from '@/core/optional';
import { UniqueEntityId } from '@/core/unique-entity-id';

export enum InputTypeEnum {
  AUDIO = 'audio',
  PICTURE = 'picture',
}

export enum MealStatusEnum {
  UPLOADING = 'uploading',
  QUEUED = 'queued',
  PROCESSING = 'processing',
  SUCCESS = 'success',
  FAILED = 'failed',
}

type MealProps = {
  name: string;
  icon: string;
  userId: UniqueEntityId;
  status: MealStatusEnum;
  inputType: InputTypeEnum;
  inputFileKey: string;
  foods: Array<unknown>;
  createdAt: Date;
  updatedAt: Date;
};

export class Meal extends Entity<MealProps> {
  static create(
    data: Optional<MealProps, 'status' | 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityId
  ): Meal {
    return new Meal(
      {
        ...data,
        status: data.status ?? MealStatusEnum.UPLOADING,
        createdAt: data.createdAt ?? new Date(),
        updatedAt: data.updatedAt ?? new Date(),
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

  get icon() {
    return this.props.icon;
  }

  set icon(value: string) {
    this.props.icon = value;
    this.touch();
  }

  get userId() {
    return this.props.userId;
  }

  set userId(value: UniqueEntityId) {
    this.props.userId = value;
    this.touch();
  }

  get status() {
    return this.props.status;
  }

  set status(value: MealStatusEnum) {
    this.props.status = value;
    this.touch();
  }

  get inputType() {
    return this.props.inputType;
  }

  set inputType(value: InputTypeEnum) {
    this.props.inputType = value;
    this.touch();
  }

  get inputFileKey() {
    return this.props.inputFileKey;
  }

  set inputFileKey(value: string) {
    this.props.inputFileKey = value;
    this.touch();
  }

  get foods() {
    return this.props.foods;
  }

  set foods(value: Array<unknown>) {
    this.props.foods = value;
    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }
}
