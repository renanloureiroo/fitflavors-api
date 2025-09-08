import { FetchProfileDTO } from '../dtos/fetch-profile.dto';
import { User } from '../entities/user';
import { UserRepository } from '../repositories/user.repository';

type FetchProfileUsecaseResult = {
  user: User;
};

export class FetchProfileUsecase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(data: FetchProfileDTO): Promise<FetchProfileUsecaseResult> {
    const user = await this.userRepository.findById(data.id);

    return { user: user! };
  }
}
