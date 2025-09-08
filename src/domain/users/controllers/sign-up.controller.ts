import { z } from 'zod';
import { HttpHandler } from '@/core/http/http-handler';
import { Valid } from '@/core/decorators/valid.decorator';
import { HttpRequest, HttpResponse } from '@/core/http/types/http';
import { DrizzleUserRepository } from '@/infra/db/drizzle/repositories/drizzle-user.repository';
import { CreateAccountUsecase } from '../usecases/create-account.usecase';
import { JwtProviderImpl, PasswordProviderImpl } from '@/infra/providers';
import { HandlerAppError } from '@/core/utils/handler-app-error';

const schema = z.object({
  goal: z.enum(['lose', 'maintain', 'gain']),
  gender: z.enum(['male', 'female']),
  birthDate: z.iso.date(),
  height: z.number().positive('A altura deve ser um número positivo'),
  weight: z.number().positive('O peso deve ser um número positivo'),
  activityLevel: z
    .number()
    .min(1, 'Nível de atividade inválido')
    .max(5, 'Nível de atividade inválido'),
  account: z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    email: z.email('Email deve ter um formato válido'),
    password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
  }),
});

type SignUpRequest = z.infer<typeof schema>;

export class SignUpController {
  static async handle(
    @Valid(schema)
    request: HttpRequest<SignUpRequest>
  ): Promise<HttpResponse> {
    try {
      const repository = new DrizzleUserRepository();
      const jwtProvider = new JwtProviderImpl();
      const passwordProvider = new PasswordProviderImpl();

      const usecase = new CreateAccountUsecase(
        repository,
        jwtProvider,
        passwordProvider
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
      return HttpHandler.created(result);
    } catch (error) {
      return HandlerAppError.handle(error);
    }
  }
}
