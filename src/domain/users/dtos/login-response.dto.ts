import { z } from 'zod';
import { TokensResponseDTO } from './tokens-response.dto';

export const schema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export type SignInRequest = z.infer<typeof schema>;

export type LoginResponseDTO = TokensResponseDTO;
