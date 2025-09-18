import { and, eq, gte, lt } from 'drizzle-orm';
import { db } from '..';
import { OTPVerification } from '@/domain/users/entities/otp-verification';
import { OTPVerificationRepository } from '@/domain/users/repositories/otp-verification.repository';
import { otpVerifications } from '../schema';
import { DrizzleOTPVerificationMapper } from '../mapper/drizzle-otp-verification.mapper';

export class DrizzleOTPVerificationRepository
  implements OTPVerificationRepository
{
  async create(otpVerification: OTPVerification): Promise<void> {
    const data = DrizzleOTPVerificationMapper.toPersistence(otpVerification);

    await db.insert(otpVerifications).values(data);
  }

  async findActiveByPhoneNumber(
    countryCode: string,
    areaCode: string,
    phoneNumber: string
  ): Promise<OTPVerification | null> {
    const now = new Date();

    const result = await db
      .select()
      .from(otpVerifications)
      .where(
        and(
          eq(otpVerifications.countryCode, countryCode),
          eq(otpVerifications.areaCode, areaCode),
          eq(otpVerifications.phoneNumber, phoneNumber),
          eq(otpVerifications.verified, false),
          gte(otpVerifications.expiresAt, now)
        )
      )
      .orderBy(otpVerifications.createdAt)
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    return DrizzleOTPVerificationMapper.toDomain(result[0]!);
  }

  async findByPhoneNumberAndCode(
    countryCode: string,
    areaCode: string,
    phoneNumber: string,
    code: string
  ): Promise<OTPVerification | null> {
    const result = await db
      .select()
      .from(otpVerifications)
      .where(
        and(
          eq(otpVerifications.countryCode, countryCode),
          eq(otpVerifications.areaCode, areaCode),
          eq(otpVerifications.phoneNumber, phoneNumber),
          eq(otpVerifications.code, code)
        )
      )
      .orderBy(otpVerifications.createdAt)
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    return DrizzleOTPVerificationMapper.toDomain(result[0]!);
  }

  async update(otpVerification: OTPVerification): Promise<void> {
    const data = DrizzleOTPVerificationMapper.toPersistence(otpVerification);

    await db
      .update(otpVerifications)
      .set({
        verified: data.verified,
        attempts: data.attempts,
        updatedAt: data.updatedAt,
      })
      .where(eq(otpVerifications.id, data.id!));
  }

  async hasRecentRequest(
    countryCode: string,
    areaCode: string,
    phoneNumber: string,
    withinMinutes: number
  ): Promise<boolean> {
    const cutoffTime = new Date();
    cutoffTime.setMinutes(cutoffTime.getMinutes() - withinMinutes);

    const result = await db
      .select({ count: otpVerifications.id })
      .from(otpVerifications)
      .where(
        and(
          eq(otpVerifications.countryCode, countryCode),
          eq(otpVerifications.areaCode, areaCode),
          eq(otpVerifications.phoneNumber, phoneNumber),
          gte(otpVerifications.createdAt, cutoffTime)
        )
      )
      .limit(1);

    return result.length > 0;
  }

  async countAttemptsByPhoneNumber(
    countryCode: string,
    areaCode: string,
    phoneNumber: string
  ): Promise<number> {
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    const result = await db
      .select({ count: otpVerifications.id })
      .from(otpVerifications)
      .where(
        and(
          eq(otpVerifications.countryCode, countryCode),
          eq(otpVerifications.areaCode, areaCode),
          eq(otpVerifications.phoneNumber, phoneNumber),
          gte(otpVerifications.createdAt, oneHourAgo)
        )
      );

    return result.length;
  }

  async deleteExpired(): Promise<void> {
    const now = new Date();

    await db
      .delete(otpVerifications)
      .where(lt(otpVerifications.expiresAt, now));
  }
}
