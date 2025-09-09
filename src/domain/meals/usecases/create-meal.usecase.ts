import { UniqueEntityId } from '@/core/unique-entity-id';
import { CreateMealDTO, FileType } from '../dtos/create-meal.dto';
import { InputTypeEnum, Meal } from '../entities/meal';
import { MealsRepository } from '../repositories/meals.repository';
import { StorageGateway } from '../gateways/storage.gateway';
import { QueueGateway } from '../gateways/queue.gateway';

type CreateMealResult = {
  meal: Meal;
  signedUrl: string;
};

export class CreateMealUsecase {
  constructor(
    private readonly mealsRepository: MealsRepository,
    private readonly storageGateway: StorageGateway,
    private readonly queueGateway: QueueGateway
  ) {}

  async execute(data: CreateMealDTO): Promise<CreateMealResult> {
    const { meal, signedUrl } = await this.createMeal(data);

    // Envia mensagem para a fila para processamento assíncrono
    await this.sendMealToQueue(meal);

    return { meal, signedUrl };
  }

  private async createMeal(data: CreateMealDTO): Promise<CreateMealResult> {
    const fileKey = this.getFileKey(data.fileType);

    const signedUrl = await this.uploadFile(fileKey);

    const meal = Meal.create({
      userId: new UniqueEntityId(data.userId),
      inputType: this.getInputType(data.fileType),
      inputFileKey: fileKey,
      foods: [],
      name: '',
      icon: '',
    });
    await this.mealsRepository.save(meal);

    return { meal, signedUrl };
  }

  private getInputType(fileType: FileType): InputTypeEnum {
    return fileType === 'audio/m4a'
      ? InputTypeEnum.AUDIO
      : InputTypeEnum.PICTURE;
  }

  private getFileKey(fileType: FileType): string {
    const fileId = new UniqueEntityId();

    const ext = fileType === 'audio/m4a' ? '.m4a' : '.jpeg';

    return `${fileId.toString()}${ext}`;
  }

  private async uploadFile(fileKey: string): Promise<string> {
    await this.storageGateway.uploadFile(fileKey);

    const signedUrl = await this.storageGateway.getSignedUrl(fileKey);

    return signedUrl;
  }

  private async sendMealToQueue(meal: Meal): Promise<void> {
    const messageBody = JSON.stringify({
      mealId: meal.id.toString(),
      userId: meal.userId.toString(),
      inputType: meal.inputType,
      inputFileKey: meal.inputFileKey,
      createdAt: meal.createdAt,
    });

    const messageAttributes = {
      eventType: 'MEAL_CREATED',
      mealId: meal.id.toString(),
      userId: meal.userId.toString(),
    };

    await this.queueGateway.sendMessage(messageBody, messageAttributes);
  }
}
