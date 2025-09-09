import { z } from 'zod';
import { MealResponseDTO } from './meal-response.dto';

export const fetchMealSchema = z.object({
  id: z.string().uuid('ID deve ser um UUID válido'),
});

export type FetchMealDTO = z.infer<typeof fetchMealSchema>;

export type FetchMealResponseDTO = {
  meal: MealResponseDTO;
};
