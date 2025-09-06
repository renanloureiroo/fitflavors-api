import { CreateAccountDTO } from '../dtos/create-account.dto';
import { Gender, Goal, User } from '../entities/user';
import { UserAlreadyExistsError } from '../errors/user-already-exists.error';
import { UserRepository } from '../repositories/user.repository';

interface CreateAccountUsecaseResult {
  accessToken: string;
}

export class CreateAccountUsecase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(data: CreateAccountDTO): Promise<CreateAccountUsecaseResult> {
    const userAlreadyExists = await this.hasAccountWithEmail(data.email);

    if (userAlreadyExists) {
      throw new UserAlreadyExistsError();
    }

    const user = this.createUser(data);
    const accessToken = this.generateAccessToken(user);

    return {
      accessToken,
    };
  }

  private hasAccountWithEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  private createUser(data: CreateAccountDTO): User {
    return User.create({
      name: data.name,
      email: data.email,
      password: data.password,
      gender: data.gender as Gender,
      goal: data.goal as Goal,
      birthDate: new Date(data.birthDate),
      height: data.height,
      weight: data.weight,
      activityLevel: data.activityLevel,
    });
  }

  private generateAccessToken(_user: User): string {
    return '1234567890';
  }
}
