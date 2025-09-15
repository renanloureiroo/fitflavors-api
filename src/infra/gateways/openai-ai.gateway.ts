import { Food } from '@/domain/meals/entities/meal';
import OpenAI, { toFile } from 'openai';

type GetMealDetailsFormTextParams = {
  text: string;
  createdAt: Date;
};

export type MealDetails = {
  name: string;
  icon: string;
  foods: Food[];
};

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

  private parseResponse(response: string): MealDetails {
    return JSON.parse(response);
  }
}
