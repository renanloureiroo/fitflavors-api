import { User } from '../entities/user';
import { UserRepository } from '../repositories/user.repository';

import { PasswordProvider } from '@/infra/providers/password.provider';
import { InvalidCredentialsError } from '../errors/invalid-credentials.error';
import { JwtProvider } from '../providers/jwt.provider';

type SignInUsecaseRequest = {
  email: string;
  password: string;
};

type SignInUsecaseResult = {
  accessToken: string;
  refreshToken: string;
};

export class SignInUsecase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtProvider: JwtProvider,
    private readonly passwordProvider: PasswordProvider
  ) {}

  async execute(data: SignInUsecaseRequest): Promise<SignInUsecaseResult> {
    const user = await this.findUserByEmail(data.email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isPasswordValid = await this.passwordProvider.comparePassword(
      data.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    const { accessToken, refreshToken } = this.generateTokens(user);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
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
