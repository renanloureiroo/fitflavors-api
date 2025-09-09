import { Valid } from '@/core/decorators/valid.decorator';
import { DefaultType, HttpRequest } from '@/core/http/types/http';
import { HttpHandler } from '@/core/http/http-handler';
import { FetchMealUsecase } from '../usecases/fetch-meal.usecase';
import { DrizzleMealsRepository } from '@/infra/db/drizzle/repositories/drizzle-meals.repository';
import { MealPresenter } from '../presenters/meal.presenter';
import {
  FetchMealDTO,
  FetchMealResponseDTO,
  fetchMealSchema,
} from '../dtos/fetch-meal.dto';

export class FetchMealController {
  static async handle(
    @Valid(fetchMealSchema, { target: 'params' })
    request: HttpRequest<DefaultType, FetchMealDTO, DefaultType>
  ) {
    const { userId } = request.context;
    const { id } = request.params;

    const fetchMealUsecase = new FetchMealUsecase(new DrizzleMealsRepository());

    const meal = await fetchMealUsecase.execute({
      id,
      userId,
    });

    return HttpHandler.ok<FetchMealResponseDTO>({
      meal: MealPresenter.toHTTP(meal),
    });
  }
}
