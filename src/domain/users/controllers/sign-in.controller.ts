import { HttpHandler } from '@/core/http/http-handler';
import { HttpRequest, HttpResponse } from '@/core/http/types/http';
import { SignInUsecase } from '../usecases/sign-in.usecase';
import { DrizzleUserRepository } from '@/infra/db/drizzle/repositories/drizzle-user.repository';
import { JwtProviderImpl } from '@/infra/providers/jwt.provider';
import { PasswordProviderImpl } from '@/infra/providers/password.provider';
import { HandlerAppError } from '@/core/utils/handler-app-error';
import {
  LoginResponseDTO,
  schema,
  SignInRequest,
} from '../dtos/login-response.dto';
import { Valid } from '@/core/decorators/valid.decorator';

export class SignInController {
  static async handle(
    @Valid(schema)
    request: HttpRequest<SignInRequest>
  ): Promise<HttpResponse> {
    try {
      const { email, password } = request.body;

      const userRepository = new DrizzleUserRepository();
      const jwtProvider = new JwtProviderImpl();
      const passwordProvider = new PasswordProviderImpl();

      const signInUsecase = new SignInUsecase(
        userRepository,
        jwtProvider,
        passwordProvider
      );

      const result = await signInUsecase.execute({ email, password });

      const response: LoginResponseDTO = {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      };

      return HttpHandler.ok(response);
    } catch (error) {
      return HandlerAppError.handle(error);
    }
  }
}
