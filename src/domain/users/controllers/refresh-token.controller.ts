import { HttpHandler } from '@/core/http/http-handler';
import { HttpRequest, HttpResponse } from '@/core/http/types/http';
import { RefreshTokenUsecase } from '../usecases/refresh-token.usecase';
import { DrizzleUserRepository } from '@/infra/db/drizzle/repositories/drizzle-user.repository';
import { JwtProviderImpl } from '@/infra/providers/jwt.provider';
import { HandlerAppError } from '@/core/utils/handler-app-error';
import { TokensResponseDTO } from '../dtos/tokens-response.dto';
import { Valid } from '@/core/decorators/valid.decorator';
import { z } from 'zod';

const schema = z.object({
  refreshToken: z.string().min(1, 'Refresh token é obrigatório'),
});

type RefreshTokenRequest = z.infer<typeof schema>;

export class RefreshTokenController {
  static async handle(
    @Valid(schema)
    request: HttpRequest<RefreshTokenRequest>
  ): Promise<HttpResponse> {
    try {
      const { refreshToken } = request.body;

      const userRepository = new DrizzleUserRepository();
      const jwtProvider = new JwtProviderImpl();

      const refreshTokenUsecase = new RefreshTokenUsecase(
        userRepository,
        jwtProvider
      );

      const result = await refreshTokenUsecase.execute(refreshToken);

      const response: TokensResponseDTO = {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      };

      return HttpHandler.ok(response);
    } catch (error) {
      return HandlerAppError.handle(error);
    }
  }
}
