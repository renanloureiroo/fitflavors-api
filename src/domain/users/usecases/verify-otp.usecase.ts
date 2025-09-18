import { OTPVerificationRepository } from '../repositories/otp-verification.repository';
import { UserRepository } from '../repositories/user.repository';
import { InvalidOTPError } from '../errors/invalid-otp.error';
import { ExpiredOTPError } from '../errors/expired-otp.error';
import { TooManyOTPAttemptsError } from '../errors/too-many-otp-attempts.error';

interface VerifyOTPUsecaseRequest {
  countryCode: string;
  areaCode: string;
  phoneNumber: string;
  code: string;
  userId: string;
}

interface VerifyOTPUsecaseResponse {
  verified: true;
  phoneNumber: string;
  message: string;
}

export class VerifyOTPUsecase {
  constructor(
    private readonly otpRepository: OTPVerificationRepository,
    private readonly userRepository: UserRepository
  ) {}

  async execute(
    request: VerifyOTPUsecaseRequest
  ): Promise<VerifyOTPUsecaseResponse> {
    const { countryCode, areaCode, phoneNumber, code, userId } = request;

    // Buscar OTP ativo por telefone
    const otpVerification = await this.otpRepository.findActiveByPhoneNumber(
      countryCode,
      areaCode,
      phoneNumber
    );

    if (!otpVerification) {
      throw new InvalidOTPError();
    }

    // Verificar se ainda pode tentar
    if (!otpVerification.canAttempt()) {
      if (otpVerification.isExpired()) {
        throw new ExpiredOTPError();
      }
      throw new TooManyOTPAttemptsError();
    }

    // Incrementar tentativa
    otpVerification.incrementAttempt();

    // Verificar se o código está correto
    if (!otpVerification.isValid(code)) {
      await this.otpRepository.update(otpVerification);

      if (otpVerification.isExpired()) {
        throw new ExpiredOTPError();
      }
      throw new InvalidOTPError();
    }

    // Marcar como verificado
    otpVerification.verified = true;
    await this.otpRepository.update(otpVerification);

    // Atualizar dados do telefone no usuário logado
    await this.userRepository.updatePhoneData(
      userId,
      countryCode,
      areaCode,
      phoneNumber,
      true
    );

    const fullPhoneNumber = `+${countryCode}${areaCode}${phoneNumber}`;

    return {
      verified: true,
      phoneNumber: fullPhoneNumber,
      message: 'Telefone verificado com sucesso!',
    };
  }
}
