import { Valid } from '@/core/decorators/valid.decorator';
import { DefaultType, HttpRequest } from '@/core/http/types/http';
import { HttpHandler } from '@/core/http/http-handler';
import { DeleteMealUseCase } from '../usecases/delete-meal.usecase';
import { DrizzleMealsRepository } from '@/infra/db/drizzle/repositories/drizzle-meals.repository';
import { DeleteMealDTO, deleteMealSchema } from '../dtos/delete-meal.dto';

export class DeleteMealController {
  static async handle(
    @Valid(deleteMealSchema, { target: 'params' })
    request: HttpRequest<DefaultType, DeleteMealDTO, DefaultType>
  ) {
    const { userId } = request.context;
    const { mealId } = request.params;

    const deleteMealUseCase = new DeleteMealUseCase(
      new DrizzleMealsRepository()
    );

    await deleteMealUseCase.execute({
      mealId,
      userId,
    });

    return HttpHandler.noContent();
  }
}
