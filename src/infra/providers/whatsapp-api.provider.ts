import axios, { AxiosInstance } from 'axios';
import { env } from '../env';
import {
  WhatsAppMessage,
  WhatsAppGateway,
} from '@/domain/users/gateways/whatsapp.gateway';

export class WhatsAppApiGateway implements WhatsAppGateway {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: env.WHATSAPP_API_URL,
      headers: {
        Authorization: `Bearer ${env.WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
  }

  async sendOTP(phoneNumber: string, code: string): Promise<WhatsAppMessage> {
    try {
      const payload = {
        messaging_product: 'whatsapp',
        to: phoneNumber,
        type: 'template',
        template: {
          name: env.WHATSAPP_OTP_TEMPLATE_NAME,
          language: {
            code: 'pt_BR',
          },
          components: [
            {
              type: 'body',
              parameters: [
                {
                  type: 'text',
                  text: code,
                },
              ],
            },
            {
              type: 'button',
              sub_type: 'url',
              index: '0',
              parameters: [
                {
                  type: 'text',
                  text: code,
                },
              ],
            },
          ],
        },
      };

      const response = await this.client.post(
        `/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
        payload
      );

      return {
        messageId: response.data.messages[0].id,
        status: 'sent',
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('WhatsApp API Error:', error);
      throw new Error(
        `Falha ao enviar mensagem WhatsApp: ${
          error instanceof Error ? error.message : 'Erro desconhecido'
        }`
      );
    }
  }

  async isHealthy(): Promise<boolean> {
    try {
      await this.client.get(`/${env.WHATSAPP_PHONE_NUMBER_ID}`, {
        timeout: 5000,
      });
      return true;
    } catch {
      return false;
    }
  }
}
