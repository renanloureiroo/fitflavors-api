import { z } from 'zod';

export const schema = z.object({
  fileType: z.enum(['audio/m4a', 'image/jpeg']),
});

export type CreateMealRequest = z.infer<typeof schema>;

export type CreateMealDTO = {
  fileType: 'audio/m4a' | 'image/jpeg';
  userId: string;
};

export type CreateMealResponseDTO = {
  meal: {
    id: string;
    name: string;
    icon: string;
    userId: string;
    status: string;
    inputType: string;
    inputFileKey: string;
    foods: Array<unknown>;
  };
};
