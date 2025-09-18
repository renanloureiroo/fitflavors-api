import { Entity } from '@/core/entitiy';
import { Optional } from '@/core/optional';
import { UniqueEntityId } from '@/core/unique-entity-id';
import { nowUTC } from '@/core/utils/date-utils';

export type OTPVerificationProps = {
  countryCode: string;
  areaCode: string;
  phoneNumber: string;
  code: string;
  expiresAt: Date;
  verified: boolean;
  attempts: number;
  createdAt: Date;
  updatedAt: Date;
};

class OTPVerification extends Entity<OTPVerificationProps> {
  static create(
    data: Optional<
      OTPVerificationProps,
      'verified' | 'attempts' | 'createdAt' | 'updatedAt'
    >,
    id?: UniqueEntityId
  ): OTPVerification {
    return new OTPVerification(
      {
        ...data,
        verified: data.verified ?? false,
        attempts: data.attempts ?? 0,
        createdAt: data.createdAt ?? nowUTC(),
        updatedAt: data.updatedAt ?? nowUTC(),
      },
      id ?? new UniqueEntityId()
    );
  }

  static generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static createExpirationDate(minutesFromNow = 5): Date {
    const expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() + minutesFromNow);
    return expiration;
  }

  get countryCode() {
    return this.props.countryCode;
  }

  get areaCode() {
    return this.props.areaCode;
  }

  get phoneNumber() {
    return this.props.phoneNumber;
  }

  // Método para obter o número completo no formato internacional
  get fullPhoneNumber(): string {
    return `+${this.props.countryCode}${this.props.areaCode}${this.props.phoneNumber}`;
  }

  get code() {
    return this.props.code;
  }

  get expiresAt() {
    return this.props.expiresAt;
  }

  get verified() {
    return this.props.verified;
  }

  set verified(value: boolean) {
    this.props.verified = value;
    this.touch();
  }

  get attempts() {
    return this.props.attempts;
  }

  incrementAttempt(): void {
    this.props.attempts += 1;
    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  isExpired(): boolean {
    return nowUTC() > this.props.expiresAt;
  }

  isValid(inputCode: string): boolean {
    return (
      !this.isExpired() &&
      !this.props.verified &&
      this.props.code === inputCode &&
      this.props.attempts < 5
    );
  }

  canAttempt(): boolean {
    return this.props.attempts < 5 && !this.props.verified && !this.isExpired();
  }

  private touch() {
    this.props.updatedAt = nowUTC();
  }
}

export { OTPVerification };
