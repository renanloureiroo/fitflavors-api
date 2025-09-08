import { UniqueEntityId } from '@/core/unique-entity-id';
import { CreateMealDTO } from '../dtos/create-meal.dto';
import { InputTypeEnum, Meal } from '../entities/meal';
import { MealsRepository } from '../repositories/meals.repository';

export class CreateMealUsecase {
  constructor(private readonly mealsRepository: MealsRepository) {}

  async execute(data: CreateMealDTO): Promise<Meal> {
    const meal = await this.createMeal(data);

    return meal;
  }

  private async createMeal(data: CreateMealDTO): Promise<Meal> {
    const meal = Meal.create({
      userId: new UniqueEntityId(data.userId),
      inputType: this.getInputType(data.fileType),
      inputFileKey: 'input_file_key',
      foods: [],
      name: '',
      icon: '',
    });
    await this.mealsRepository.save(meal);

    return meal;
  }

  private getInputType(fileType: string): InputTypeEnum {
    return fileType === 'audio/m4a'
      ? InputTypeEnum.AUDIO
      : InputTypeEnum.PICTURE;
  }
}
