import { Valid } from '@/core/decorators/valid.decorator';
import { DefaultType, HttpRequest } from '@/core/http/types/http';
import { HttpHandler } from '@/core/http/http-handler';
import { ListMealsUsecase } from '../usecases/list-meals.usecase';
import { DrizzleMealsRepository } from '@/infra/db/drizzle/repositories/drizzle-meals.repository';
import { MealPresenter } from '../presenters/meal.presenter';
import {
  ListMealsDTO,
  ListMealsResponseDTO,
  listMealsSchema,
} from '../dtos/list-meals.dto';

export class ListMealsController {
  static async handle(
    @Valid(listMealsSchema, { target: 'queryParams' })
    request: HttpRequest<DefaultType, DefaultType, ListMealsDTO>
  ) {
    const { userId } = request.context;
    const { date } = request.queryParams;

    const listMealsUsecase = new ListMealsUsecase(new DrizzleMealsRepository());

    const meals = await listMealsUsecase.execute({
      userId,
      date,
    });

    return HttpHandler.ok<ListMealsResponseDTO>({
      meals: meals.map(MealPresenter.toHTTP),
    });
  }
}
