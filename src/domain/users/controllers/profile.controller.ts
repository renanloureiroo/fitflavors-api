import { HttpRequest } from '@/core/http/types/http';
import { HandlerAppError } from '@/core/utils/handler-app-error';
import { HttpHandler } from '@/core/http/http-handler';
import { UserPresenter } from '../presenters/user.presenter';
import { FetchProfileUsecase } from '../usecases/fetch-profile.usecase';
import { DrizzleUserRepository } from '@/infra/db/drizzle/repositories/drizzle-user.repository';
import { FetchProfileResponseDTO } from '../dtos/fetch-profile-response.dto';

export class ProfileController {
  static async handle(request: HttpRequest) {
    try {
      const { context } = request;

      const fetchProfileUsecase = new FetchProfileUsecase(
        new DrizzleUserRepository()
      );
      const user = await fetchProfileUsecase.execute({
        id: context.userId,
      });

      const response: FetchProfileResponseDTO = {
        profile: UserPresenter.toHTTP(user.user),
      };

      return HttpHandler.ok(response);
    } catch (error) {
      return HandlerAppError.handle(error);
    }
  }
}
