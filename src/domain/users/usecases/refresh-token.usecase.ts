import { User } from '../entities/user';
import { InvalidTokenError } from '../errors/invalid-token.error';
import { JwtProvider } from '../providers/jwt.provider';
import { UserRepository } from '../repositories/user.repository';

type RefreshTokenUsecaseResult = {
  accessToken: string;
  refreshToken: string;
};

export class RefreshTokenUsecase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtProvider: JwtProvider
  ) {}

  async execute(data: string): Promise<RefreshTokenUsecaseResult> {
    const decoded = this.jwtProvider.verifyToken(data);

    if (!decoded) {
      throw new InvalidTokenError();
    }

    const user = await this.userRepository.findById(decoded.sub);

    if (!user) {
      throw new InvalidTokenError();
    }

    const { accessToken, refreshToken } = this.generateTokens(user);

    return {
      accessToken,
      refreshToken,
    };
  }

  private generateTokens(user: User): {
    accessToken: string;
    refreshToken: string;
  } {
    const accessToken = this.jwtProvider.generateToken({
      sub: user.id.toString(),
      email: user.email,
    });

    const refreshToken = this.jwtProvider.generateToken(
      {
        sub: user.id.toString(),
        email: user.email,
      },
      { expiresIn: '15d' }
    );

    return { accessToken, refreshToken };
  }
}
