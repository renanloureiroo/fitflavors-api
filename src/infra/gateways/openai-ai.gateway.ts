import OpenAI, { toFile } from 'openai';

export class OpenaiAiGateway {
  private readonly openai: OpenAI;
  constructor() {
    this.openai = new OpenAI({});
  }

  async transcribeAudio(audio: Buffer): Promise<string> {
    const text = await this.openai.audio.transcriptions.create({
      file: await toFile(audio, 'audio.mp4', { type: 'audio/mp4' }),
      model: 'whisper-1',
      language: 'pt',
      response_format: 'text',
    });

    return text;
  }
}
