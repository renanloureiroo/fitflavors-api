import z from 'zod';

export const listMealsSchema = z.object({
  date: z.iso.date(),
});

export type ListMealsDTO = z.infer<typeof listMealsSchema>;

export type ListMealsResponseDTO = {
  meals: Array<{
    id: string;
    name: string;
    icon: string;
    userId: string;
    status: string;
    inputType: string;
    inputFileKey: string;
    foods: Array<unknown>;
    createdAt: Date;
  }>;
};
