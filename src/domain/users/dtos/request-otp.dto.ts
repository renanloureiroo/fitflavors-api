import { z } from 'zod';

export const requestOTPSchema = z.object({
  countryCode: z
    .string()
    .regex(/^[1-9]\d{0,3}$/, 'Código do país deve conter apenas números')
    .min(1, 'Código do país é obrigatório')
    .max(4, 'Código do país muito longo'),
  areaCode: z
    .string()
    .regex(/^\d{2}$/, 'DDD deve conter exatamente 2 dígitos')
    .length(2, 'DDD deve ter 2 dígitos'),
  phoneNumber: z
    .string()
    .regex(/^\d{8,9}$/, 'Número deve conter 8 ou 9 dígitos')
    .min(8, 'Número muito curto')
    .max(9, 'Número muito longo'),
});

export type RequestOTPRequest = z.infer<typeof requestOTPSchema>;

export interface RequestOTPResponse extends Record<string, unknown> {
  message: string;
  expiresIn: number; // segundos
}
