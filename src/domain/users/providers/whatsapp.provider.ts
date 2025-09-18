export interface WhatsAppMessage {
  messageId: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: Date;
}

export interface WhatsAppProvider {
  sendOTP(phoneNumber: string, code: string): Promise<WhatsAppMessage>;
  isHealthy(): Promise<boolean>;
}
