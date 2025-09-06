import { z } from 'zod';
import { HttpHandler } from '../../../core/http/http-handler';
import { HttpRequest, HttpResponse } from '../../../core/http/types/http';

const _schema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

type SignInRequest = z.infer<typeof _schema>;

export class SignInController {
  static async handle(
    _request: HttpRequest<SignInRequest>
  ): Promise<HttpResponse> {
    return HttpHandler.ok({ accessToken: '1234567890' });
  }
}
