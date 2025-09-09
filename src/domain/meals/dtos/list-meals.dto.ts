import z from 'zod';
import { MealResponseDTO } from './meal-response.dto';

export const listMealsSchema = z.object({
  date: z.iso.date(),
});

export type ListMealsDTO = z.infer<typeof listMealsSchema>;

export type ListMealsResponseDTO = {
  meals: Array<MealResponseDTO>;
};
