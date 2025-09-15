import { z } from 'zod';

export const schema = z.object({
  fileType: z.enum(['audio/m4a', 'image/jpeg']),
});

export type CreateMealRequest = z.infer<typeof schema>;

export type FileType = 'audio/m4a' | 'image/jpeg';

export type CreateMealDTO = {
  fileType: FileType;
  userId: string;
};

export type CreateMealResponseDTO = {
  mealId: string;
  signedUrl: string;
};
