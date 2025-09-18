import { z } from 'zod';

export const verifyOTPSchema = z.object({
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
  code: z
    .string()
    .regex(/^\d{6}$/, 'Código deve ter exatamente 6 dígitos')
    .length(6, 'Código deve ter 6 dígitos'),
});

export type VerifyOTPRequest = z.infer<typeof verifyOTPSchema>;

export interface VerifyOTPResponse extends Record<string, unknown> {
  verified: true;
  phoneNumber: string;
  message: string;
}
