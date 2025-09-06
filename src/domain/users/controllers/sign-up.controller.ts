import { z } from 'zod';
import { HttpHandler } from '../../../core/http/http-handler';
import { HttpRequest, HttpResponse, Valid } from '../../../core/http';

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
    return HttpHandler.created({
      accessToken: '1234567890',
      user: {
        id: 'user-123',
        name: request.body.account.name,
        email: request.body.account.email,
      },
    });
  }
}
