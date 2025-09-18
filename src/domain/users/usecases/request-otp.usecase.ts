import { OTPVerification } from '../entities/otp-verification';
import { OTPVerificationRepository } from '../repositories/otp-verification.repository';
import { WhatsAppProvider } from '../providers/whatsapp.provider';
import { OTPRateLimitError } from '../errors/otp-rate-limit.error';

interface RequestOTPUsecaseRequest {
  countryCode: string;
  areaCode: string;
  phoneNumber: string;
  userId: string;
}

interface RequestOTPUsecaseResponse {
  expiresIn: number;
}

export class RequestOTPUsecase {
  constructor(
    private readonly otpRepository: OTPVerificationRepository,
    private readonly whatsappProvider: WhatsAppProvider
  ) {}

  async execute(
    request: RequestOTPUsecaseRequest
  ): Promise<RequestOTPUsecaseResponse> {
    const { countryCode, areaCode, phoneNumber } = request;

    // Montar o número completo para verificar rate limiting
    const fullPhoneNumber = `+${countryCode}${areaCode}${phoneNumber}`;

    // Verificar rate limiting (1 por minuto)
    const hasRecentRequest = await this.otpRepository.hasRecentRequest(
      countryCode,
      areaCode,
      phoneNumber,
      1
    );

    if (hasRecentRequest) {
      throw new OTPRateLimitError(60);
    }

    // Gerar código OTP
    const code = OTPVerification.generateCode();
    const expiresAt = OTPVerification.createExpirationDate(5); // 5 minutos

    // Criar entidade OTPVerification
    const otpVerification = OTPVerification.create({
      countryCode,
      areaCode,
      phoneNumber,
      code,
      expiresAt,
    });

    // Salvar no banco
    await this.otpRepository.create(otpVerification);

    // Enviar via WhatsApp
    try {
      await this.whatsappProvider.sendOTP(fullPhoneNumber, code);
    } catch (error) {
      console.error('Erro ao enviar WhatsApp:', error);
      // Em produção, você pode querer marcar o OTP como falha
      // ou implementar retry logic
      throw new Error('Falha ao enviar mensagem. Tente novamente.');
    }

    return {
      expiresIn: 300, // 5 minutos em segundos
    };
  }
}
