import {
  SQSClient,
  SendMessageCommand,
  SendMessageBatchCommand,
} from '@aws-sdk/client-sqs';
import { env } from '../env';
import { QueueGateway } from '@/domain/meals/gateways/queue.gateway';

/**
 * Implementação do QueueGateway usando AWS SQS
 * Esta é a implementação concreta na camada de infraestrutura
 */
export class SQSQueueGateway implements QueueGateway {
  private readonly sqsClient: SQSClient;
  private readonly queueUrl: string;

  constructor() {
    this.queueUrl = env.AWS_SQS_MEALS_QUEUE_URL ?? '';
    this.sqsClient = new SQSClient();
  }

  async sendMessage(
    messageBody: string,
    messageAttributes?: Record<string, string>
  ): Promise<void> {
    try {
      const command = new SendMessageCommand({
        QueueUrl: this.queueUrl,
        MessageBody: messageBody,
        MessageAttributes: messageAttributes
          ? this.formatMessageAttributes(messageAttributes)
          : undefined,
      });

      await this.sqsClient.send(command);
    } catch (error) {
      throw new Error(
        `SQS_SEND_MESSAGE_ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async sendBatchMessages(
    messages: Array<{
      body: string;
      attributes?: Record<string, string>;
    }>
  ): Promise<void> {
    try {
      const entries = messages.map((message, index) => ({
        Id: `message-${index}`,
        MessageBody: message.body,
        MessageAttributes: message.attributes
          ? this.formatMessageAttributes(message.attributes)
          : undefined,
      }));

      const command = new SendMessageBatchCommand({
        QueueUrl: this.queueUrl,
        Entries: entries,
      });

      await this.sqsClient.send(command);
    } catch (error) {
      throw new Error(
        `SQS_SEND_BATCH_MESSAGES_ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Formata os atributos da mensagem para o formato esperado pelo SQS
   */
  private formatMessageAttributes(attributes: Record<string, string>) {
    return Object.entries(attributes).reduce(
      (acc, [key, value]) => {
        acc[key] = {
          StringValue: value,
          DataType: 'String',
        };
        return acc;
      },
      {} as Record<string, { StringValue: string; DataType: string }>
    );
  }
}
