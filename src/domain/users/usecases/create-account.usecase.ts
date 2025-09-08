import { CreateAccountDTO } from '../dtos/create-account.dto';
import { Gender, Goal, User } from '../entities/user';
import { UserAlreadyExistsError } from '../errors/user-already-exists.error';
import { UserRepository } from '../repositories/user.repository';
import { JwtProvider } from '@/infra/providers/jwt.provider';
import { PasswordProvider } from '@/infra/providers/password.provider';

type CreateAccountUsecaseResult = {
  accessToken: string;
};

export class CreateAccountUsecase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtProvider: JwtProvider,
    private readonly passwordProvider: PasswordProvider
  ) {}

  async execute(data: CreateAccountDTO): Promise<CreateAccountUsecaseResult> {
    const userAlreadyExists = await this.hasAccountWithEmail(data.email);

    if (userAlreadyExists) {
      throw new UserAlreadyExistsError();
    }

    const user = await this.createUser(data);

    const accessToken = this.generateAccessToken(user);
    console.log(accessToken);

    return {
      accessToken,
    };
  }

  private hasAccountWithEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  private async createUser(data: CreateAccountDTO): Promise<User> {
    const hashedPassword = await this.passwordProvider.hashPassword(
      data.password
    );

    const user = User.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      gender: data.gender as Gender,
      goal: data.goal as Goal,
      birthDate: new Date(data.birthDate),
      height: data.height,
      weight: data.weight,
      activityLevel: data.activityLevel,
    });
    await this.userRepository.save(user);

    return user;
  }

  private generateAccessToken(user: User): string {
    return this.jwtProvider.generateToken({
      sub: user.id.toString(),
      email: user.email,
    });
  }
}
