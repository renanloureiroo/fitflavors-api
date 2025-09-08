import { z } from 'zod';
import { HttpHandler } from '@/core/http/http-handler';
import { HttpRequest, HttpResponse } from '@/core/http/types/http';
import { SignInUsecase } from '../usecases/sign-in.usecase';
import { DrizzleUserRepository } from '@/infra/db/drizzle/repositories/drizzle-user.repository';
import { JwtProviderImpl } from '@/infra/providers/jwt.provider';
import { PasswordProviderImpl } from '@/infra/providers/password.provider';
import { HandlerAppError } from '@/core/utils/handler-app-error';
import { LoginResponseDTO } from '../dtos/login-response.dto';
import { Valid } from '@/core/decorators/valid.decorator';

const schema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export type SignInRequest = z.infer<typeof schema>;

export class SignInController {
  static async handle(
    @Valid(schema)
    request: HttpRequest<SignInRequest>
  ): Promise<HttpResponse> {
    try {
      const { email, password } = request.body;

      // Aqui você deve injetar as dependências adequadamente
      // Por enquanto, estou criando instâncias diretamente
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
