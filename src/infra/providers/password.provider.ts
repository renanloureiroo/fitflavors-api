import bcrypt from 'bcryptjs';
import { env } from '../env';

export interface PasswordProvider {
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, hashedPassword: string): Promise<boolean>;
}

export class PasswordProviderImpl implements PasswordProvider {
  private readonly saltRounds: number;

  constructor() {
    this.saltRounds = parseInt(env.ENCRYPT_SALTS ?? '12');
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
