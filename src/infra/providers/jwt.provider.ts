import { Optional } from '@/core/optional';
import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../env';

export interface JwtPayload {
  sub: string;
  email: string;
}

type JwtOptions = Optional<SignOptions, 'expiresIn'>;

export interface JwtProvider {
  generateToken(payload: JwtPayload): string;
  verifyToken(token: string): JwtPayload | null;
}

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expiresIn: this.expiresIn as any,
    }
  ): string {
    try {
      return jwt.sign(payload, this.secret, options);
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
