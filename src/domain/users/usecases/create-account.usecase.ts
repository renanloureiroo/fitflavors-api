import { CreateAccountDTO } from '../dtos/create-account.dto';
import { ActivityLevelEnum, Gender, Goal, User } from '../entities/user';
import { UserAlreadyExistsError } from '../errors/user-already-exists.error';
import { JwtProvider } from '../providers/jwt.provider';
import { UserRepository } from '../repositories/user.repository';

import { PasswordProvider } from '@/infra/providers/password.provider';
import { CalculateGoalService } from '../services/calculate-goal';

type CreateAccountUsecaseResult = {
  accessToken: string;
  refreshToken: string;
};

export class CreateAccountUsecase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtProvider: JwtProvider,
    private readonly passwordProvider: PasswordProvider,
    private readonly calculateGoalService: CalculateGoalService
  ) {}

  async execute(data: CreateAccountDTO): Promise<CreateAccountUsecaseResult> {
    const userAlreadyExists = await this.hasAccountWithEmail(data.email);

    if (userAlreadyExists) {
      throw new UserAlreadyExistsError();
    }

    const user = await this.createUser(data);

    const { accessToken, refreshToken } = this.generateTokens(user);

    return {
      accessToken,
      refreshToken,
    };
  }

  private hasAccountWithEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  private async createUser(data: CreateAccountDTO): Promise<User> {
    const hashedPassword = await this.passwordProvider.hashPassword(
      data.password
    );

    const goals = this.calculateGoalService.calculateGoals({
      gender: data.gender as Gender,
      birthDate: new Date(data.birthDate),
      height: data.height,
      weight: data.weight,
      activityLevel: data.activityLevel as ActivityLevelEnum,
      goal: data.goal as Goal,
    });

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
      calories: goals.calories,
      proteins: goals.proteins,
      carbohydrates: goals.carbohydrates,
      fats: goals.fats,
    });
    await this.userRepository.save(user);

    return user;
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
