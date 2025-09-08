export interface JwtPayload {
  sub: string;
  email: string;
}

export type JwtOptions = {
  expiresIn: string;
};

export interface JwtProvider {
  generateToken(payload: JwtPayload, options?: JwtOptions): string;
  verifyToken(token: string): JwtPayload | null;
}
