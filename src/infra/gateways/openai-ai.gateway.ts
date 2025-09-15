import { Food } from '@/domain/meals/entities/meal';
import OpenAI, { toFile } from 'openai';
import { z } from 'zod';

type GetMealDetailsFormTextParams = {
  text: string;
  createdAt: Date;
};

type GetMealDetailsFormPictureParams = {
  pictureUrl: string;
  createdAt: Date;
};

export type MealDetails = {
  name: string;
  icon: string;
  foods: Food[];
};

// Zod schemas for validation
const FoodSchema = z.object({
  name: z.string().min(1, 'Food name is required'),
  quantity: z.string().min(1, 'Food quantity is required'),
  calories: z.number().min(0, 'Calories must be a positive number'),
  carbohydrates: z.number().min(0, 'Carbohydrates must be a positive number'),
  proteins: z.number().min(0, 'Proteins must be a positive number'),
  fats: z.number().min(0, 'Fats must be a positive number'),
});

const MealDetailsSchema = z.object({
  name: z.string().min(1, 'Meal name is required'),
  icon: z.string().min(1, 'Meal icon is required'),
  foods: z.array(FoodSchema).min(1, 'At least one food item is required'),
});

export class OpenaiAiGateway {
  private readonly openai: OpenAI;
  constructor() {
    this.openai = new OpenAI({});
  }

  async transcribeAudio(audio: Buffer): Promise<string> {
    try {
      const file = await toFile(audio, 'audio.m4a', { type: 'audio/m4a' });
      const text = await this.openai.audio.transcriptions.create({
        file,
        model: 'whisper-1',
        language: 'pt',
        response_format: 'text',
      });

      return text;
    } catch (error) {
      console.log('error', error);
      throw new Error(
        `OPENAI_TRANSCRIBE_AUDIO_ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async getMealDetailsFormText({
    text,
    createdAt,
  }: GetMealDetailsFormTextParams): Promise<MealDetails> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `
            Você é um nutricionista e está atendendo um de seus pacientes. Você deve responder para ele seguindo as instruções a baixo.
  
            Seu papel é:
            1. Dar um nome e escolher um emoji para a refeição baseado no horário dela.
            2. Identificar os alimentos presentes na imagem.
            3. Estimar, para cada alimento identificado:
              - Nome do alimento (em português)
              - Quantidade aproximada (em gramas ou unidades)
              - Calorias (kcal)
              - Carboidratos (g)
              - Proteínas (g)
              - Gorduras (g)
  
            Seja direto, objetivo e evite explicações. Apenas retorne os dados em JSON no formato abaixo:
  
            {
              "name": "Jantar",
              "icon": "🍗",
              "foods": [
                {
                  "name": "Arroz branco cozido",
                  "quantity": "150g",
                  "calories": 193,
                  "carbohydrates": 42,
                  "proteins": 3.5,
                  "fats": 0.4
                },
                {
                  "name": "Peito de frango grelhado",
                  "quantity": "100g",
                  "calories": 165,
                  "carbohydrates": 0,
                  "proteins": 31,
                  "fats": 3.6
                }
              ]
            }
          `,
        },
        {
          role: 'user',
          content: `
            Data: ${createdAt}
            Refeição: ${text}
          `,
        },
      ],
    });
    const jsonResponse = response?.choices?.[0]?.message.content;

    if (!jsonResponse) {
      throw new Error('No response from OpenAI');
    }

    return this.parseResponse(jsonResponse);
  }

  async getMealDetailsFormPicture({
    pictureUrl,
    createdAt,
  }: GetMealDetailsFormPictureParams): Promise<MealDetails> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `
            Meal date: ${createdAt}
  
            Você é um nutricionista especializado em análise de alimentos por imagem. A imagem a seguir foi tirada por um usuário com o objetivo de registrar sua refeição.
  
            Seu papel é:
            1. Dar um nome e escolher um emoji para a refeição baseado no horário dela.
            2. Identificar os alimentos presentes na imagem.
            3. Estimar, para cada alimento identificado:
              - Nome do alimento (em português)
              - Quantidade aproximada (em gramas ou unidades)
              - Calorias (kcal)
              - Carboidratos (g)
              - Proteínas (g)
              - Gorduras (g)
  
            Considere proporções e volume visível para estimar a quantidade. Quando houver incerteza sobre o tipo exato do alimento (por exemplo, tipo de arroz, corte de carne), use o tipo mais comum. Seja direto, objetivo e evite explicações. Apenas retorne os dados em JSON no formato abaixo:
  
            {
              "name": "Jantar",
              "icon": "🍗",
              "foods": [
                {
                  "name": "Arroz branco cozido",
                  "quantity": "150g",
                  "calories": 193,
                  "carbohydrates": 42,
                  "proteins": 3.5,
                  "fats": 0.4
                },
                {
                  "name": "Peito de frango grelhado",
                  "quantity": "100g",
                  "calories": 165,
                  "carbohydrates": 0,
                  "proteins": 31,
                  "fats": 3.6
                }
              ]
            }
  
          `,
        },
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: pictureUrl,
              },
            },
          ],
        },
      ],
    });
    const jsonResponse = response?.choices?.[0]?.message.content;

    console.log(jsonResponse, null, 2);

    if (!jsonResponse) {
      throw new Error('No response from OpenAI');
    }

    return this.parseResponse(jsonResponse);
  }

  private parseResponse(response: string): MealDetails {
    try {
      let cleanResponse = response.trim();

      if (
        cleanResponse.startsWith('```json') &&
        cleanResponse.endsWith('```')
      ) {
        cleanResponse = cleanResponse.slice(7, -3).trim();
      } else if (
        cleanResponse.startsWith('```') &&
        cleanResponse.endsWith('```')
      ) {
        cleanResponse = cleanResponse.slice(3, -3).trim();
      }

      const parsed = JSON.parse(cleanResponse);

      const validatedData = MealDetailsSchema.parse(parsed);

      return validatedData;
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      console.error('Raw response:', response);

      if (error instanceof z.ZodError) {
        const errorMessages = error.issues
          .map((err: z.ZodIssue) => `${err.path.join('.')}: ${err.message}`)
          .join(', ');
        throw new Error(`Validation failed: ${errorMessages}`);
      }

      throw new Error(
        `Failed to parse OpenAI response: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
