import { Valid } from '@/core/decorators/valid.decorator';
import { HttpRequest } from '@/core/http/types/http';
import { CreateMealUsecase } from '../usecases/create-meal.usecase';
import { DrizzleMealsRepository } from '@/infra/db/drizzle/repositories/drizzle-meals.repository';
import { HttpHandler } from '@/core/http/http-handler';

import { MealPresenter } from '../presenters/meal.presenter';
import {
  CreateMealRequest,
  CreateMealResponseDTO,
  schema,
} from '../dtos/create-meal.dto';

export class CreateMealController {
  static async handle(@Valid(schema) request: HttpRequest<CreateMealRequest>) {
    const { userId } = request.context;

    const createMealUsecase = new CreateMealUsecase(
      new DrizzleMealsRepository()
    );
    const meal = await createMealUsecase.execute({
      userId,
      fileType: request.body.fileType,
    });

    return HttpHandler.created<CreateMealResponseDTO>({
      meal: MealPresenter.toHTTP(meal),
    });
  }
}
