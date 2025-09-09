import { HttpHandler } from '@/core/http/http-handler';
import { Valid } from '@/core/decorators/valid.decorator';
import { HttpRequest, HttpResponse } from '@/core/http/types/http';
import { DrizzleUserRepository } from '@/infra/db/drizzle/repositories/drizzle-user.repository';
import { CreateAccountUsecase } from '../usecases/create-account.usecase';
import { JwtProviderImpl } from '@/infra/providers/jwt.provider';
import { PasswordProviderImpl } from '@/infra/providers/password.provider';
import { HandlerAppError } from '@/core/utils/handler-app-error';
import { CalculateGoalService } from '../services/calculate-goal';
import {
  schema,
  SignUpRequest,
  CreateAccountResponseDTO,
} from '../dtos/create-account.dto';

export class SignUpController {
  static async handle(
    @Valid(schema)
    request: HttpRequest<SignUpRequest>
  ): Promise<HttpResponse> {
    try {
      const repository = new DrizzleUserRepository();
      const jwtProvider = new JwtProviderImpl();
      const passwordProvider = new PasswordProviderImpl();
      const calculateGoalService = new CalculateGoalService();
      const usecase = new CreateAccountUsecase(
        repository,
        jwtProvider,
        passwordProvider,
        calculateGoalService
      );

      const result = await usecase.execute({
        name: request.body.account.name,
        email: request.body.account.email,
        password: request.body.account.password,
        gender: request.body.gender,
        goal: request.body.goal,
        birthDate: request.body.birthDate,
        height: request.body.height,
        weight: request.body.weight,
        activityLevel: request.body.activityLevel,
      });

      const response: CreateAccountResponseDTO = {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      };

      return HttpHandler.created(response);
    } catch (error) {
      return HandlerAppError.handle(error);
    }
  }
}
