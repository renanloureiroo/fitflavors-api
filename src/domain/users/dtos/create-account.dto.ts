import { z } from 'zod';
import { TokensResponseDTO } from './tokens-response.dto';

export const schema = z.object({
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

export type SignUpRequest = z.infer<typeof schema>;

export type CreateAccountDTO = {
  name: string;
  email: string;
  password: string;
  gender: string;
  goal: string;
  birthDate: string;
  height: number;
  weight: number;
  activityLevel: number;
};

export type CreateAccountResponseDTO = TokensResponseDTO;
