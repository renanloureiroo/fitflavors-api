export type MealResponseDTO = {
  id: string;
  name: string | null;
  icon: string | null;
  status: string;
  foods: Array<unknown>;
  createdAt: string;
};
