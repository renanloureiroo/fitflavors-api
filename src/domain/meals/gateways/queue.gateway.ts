/**
 * Interface para envio de mensagens para filas
 * Define o contrato que deve ser implementado na camada de infraestrutura
 */
export interface QueueGateway {
  /**
   * Envia uma mensagem para a fila
   * @param messageBody - Conteúdo da mensagem a ser enviada
   * @param messageAttributes - Atributos opcionais da mensagem
   */
  sendMessage(
    messageBody: string,
    messageAttributes?: Record<string, string>
  ): Promise<void>;

  /**
   * Envia múltiplas mensagens para a fila em lote
   * @param messages - Array de mensagens com body e atributos opcionais
   */
  sendBatchMessages(
    messages: Array<{
      body: string;
      attributes?: Record<string, string>;
    }>
  ): Promise<void>;
}
