import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../env';
import {
  JwtOptions,
  JwtPayload,
  JwtProvider,
} from '@/domain/users/providers/jwt.provider';

export class JwtProviderImpl implements JwtProvider {
  private readonly secret: string;
  private readonly expiresIn: string;

  constructor() {
    this.secret = env.JWT_SECRET ?? 'default-secret-key';
    this.expiresIn = env.JWT_EXPIRES_IN ?? '1d';
  }

  generateToken(
    payload: Omit<JwtPayload, 'iat' | 'exp'>,
    options: JwtOptions = {
      expiresIn: this.expiresIn,
    }
  ): string {
    try {
      const tokenPayload = {
        ...payload,
        iss: 'https://fitflavors.com',
        aud: 'fitflavors-api',
      };
      return jwt.sign(tokenPayload, this.secret, options as SignOptions);
    } catch (error) {
      throw new Error(
        `TOKEN_GENERATION_ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  verifyToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, this.secret) as JwtPayload;
    } catch {
      return null;
    }
  }
}
