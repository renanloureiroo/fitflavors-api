import { OTPVerification } from '../entities/otp-verification';
import { OTPVerificationRepository } from '../repositories/otp-verification.repository';
import { WhatsAppGateway } from '../gateways/whatsapp.gateway';
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
    private readonly whatsappGateway: WhatsAppGateway
  ) {}

  async execute(
    request: RequestOTPUsecaseRequest
  ): Promise<RequestOTPUsecaseResponse> {
    const { countryCode, areaCode, phoneNumber } = request;

    const fullPhoneNumber = `+${countryCode}${areaCode}${phoneNumber}`;

    const hasRecentRequest = await this.otpRepository.hasRecentRequest(
      countryCode,
      areaCode,
      phoneNumber,
      1
    );

    if (hasRecentRequest) {
      throw new OTPRateLimitError(60);
    }

    const code = OTPVerification.generateCode();
    const expiresAt = OTPVerification.createExpirationDate(5); // 5 minutos

    const otpVerification = OTPVerification.create({
      countryCode,
      areaCode,
      phoneNumber,
      code,
      expiresAt,
    });

    await this.otpRepository.create(otpVerification);

    try {
      await this.whatsappGateway.sendOTP(fullPhoneNumber, code);
    } catch (error) {
      console.error('Erro ao enviar WhatsApp:', error);

      throw new Error('Falha ao enviar mensagem. Tente novamente.');
    }

    return {
      expiresIn: 300, // 5 minutos em segundos
    };
  }
}
