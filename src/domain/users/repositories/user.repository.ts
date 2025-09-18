import { User } from '../entities/user';

interface UserRepository {
  save(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findByPhoneNumber(
    countryCode: string,
    areaCode: string,
    phoneNumber: string
  ): Promise<User | null>;
  updatePhoneData(
    id: string,
    countryCode: string,
    areaCode: string,
    phoneNumber: string,
    verified: boolean
  ): Promise<void>;
  updatePhoneVerified(id: string, verified: boolean): Promise<void>;
}

export { UserRepository };
