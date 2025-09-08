import { User } from '../entities/user';
import { UserRepository } from '../repositories/user.repository';
import { JwtProvider } from '@/infra/providers/jwt.provider';
import { PasswordProvider } from '@/infra/providers/password.provider';
import { InvalidCredentialsError } from '../errors/invalid-credentials.error';

type SignInUsecaseRequest = {
  email: string;
  password: string;
};

type SignInUsecaseResult = {
  accessToken: string;
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

    const accessToken = this.generateAccessToken(user);

    return {
      accessToken,
    };
  }

  private async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  private generateAccessToken(user: User): string {
    return this.jwtProvider.generateToken({
      sub: user.id.toString(),
      email: user.email,
    });
  }
}
