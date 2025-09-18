import { OTPVerification } from '../entities/otp-verification';

export interface OTPVerificationRepository {
  create(otpVerification: OTPVerification): Promise<void>;
  findActiveByPhoneNumber(
    countryCode: string,
    areaCode: string,
    phoneNumber: string
  ): Promise<OTPVerification | null>;
  findByPhoneNumberAndCode(
    countryCode: string,
    areaCode: string,
    phoneNumber: string,
    code: string
  ): Promise<OTPVerification | null>;
  update(otpVerification: OTPVerification): Promise<void>;
  hasRecentRequest(
    countryCode: string,
    areaCode: string,
    phoneNumber: string,
    withinMinutes: number
  ): Promise<boolean>;
  countAttemptsByPhoneNumber(
    countryCode: string,
    areaCode: string,
    phoneNumber: string
  ): Promise<number>;
  deleteExpired(): Promise<void>;
}
