import { UniqueEntityId } from '@/core/unique-entity-id';
import { OTPVerification } from '@/domain/users/entities/otp-verification';
import { otpVerifications } from '../schema';

export class DrizzleOTPVerificationMapper {
  static toDomain(raw: typeof otpVerifications.$inferSelect): OTPVerification {
    return OTPVerification.create(
      {
        countryCode: raw.countryCode,
        areaCode: raw.areaCode,
        phoneNumber: raw.phoneNumber,
        code: raw.code,
        expiresAt: raw.expiresAt,
        verified: raw.verified,
        attempts: raw.attempts,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id)
    );
  }

  static toPersistence(
    otpVerification: OTPVerification
  ): typeof otpVerifications.$inferInsert {
    return {
      id: otpVerification.id.toString(),
      countryCode: otpVerification.countryCode,
      areaCode: otpVerification.areaCode,
      phoneNumber: otpVerification.phoneNumber,
      code: otpVerification.code,
      expiresAt: otpVerification.expiresAt,
      verified: otpVerification.verified,
      attempts: otpVerification.attempts,
      createdAt: otpVerification.createdAt,
      updatedAt: otpVerification.updatedAt,
    };
  }
}
