import { z } from 'zod';

export const deleteMealSchema = z.object({
  mealId: z.string().uuid('Invalid meal ID format'),
});

export type DeleteMealDTO = z.infer<typeof deleteMealSchema>;
