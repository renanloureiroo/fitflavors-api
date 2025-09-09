import { z } from 'zod';
import { MealResponseDTO } from './meal-response.dto';

export const schema = z.object({
  fileType: z.enum(['audio/m4a', 'image/jpeg']),
});

export type CreateMealRequest = z.infer<typeof schema>;

export type CreateMealDTO = {
  fileType: 'audio/m4a' | 'image/jpeg';
  userId: string;
};

export type CreateMealResponseDTO = {
  meal: MealResponseDTO;
};
