import { UserRepository } from '@/domain/users/repositories/user.repository';
import { User } from '@/domain/users/entities/user';
import { db } from '..';
import { users } from '../schema';
import { and, eq } from 'drizzle-orm';
import { DrizzleUserMapper } from '../mapper/drizzle-user.mapper';

class DrizzleUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = (
      await db.select().from(users).where(eq(users.email, email))
    ).at(0);

    return user ? DrizzleUserMapper.toDomain(user) : null;
  }

  async findById(id: string): Promise<User | null> {
    const user = (await db.select().from(users).where(eq(users.id, id))).at(0);

    return user ? DrizzleUserMapper.toDomain(user) : null;
  }

  async findByPhoneNumber(
    countryCode: string,
    areaCode: string,
    phoneNumber: string
  ): Promise<User | null> {
    const user = (
      await db
        .select()
        .from(users)
        .where(
          and(
            eq(users.countryCode, countryCode),
            eq(users.areaCode, areaCode),
            eq(users.phoneNumber, phoneNumber)
          )
        )
    ).at(0);

    return user ? DrizzleUserMapper.toDomain(user) : null;
  }

  async updatePhoneData(
    id: string,
    countryCode: string,
    areaCode: string,
    phoneNumber: string,
    verified: boolean
  ): Promise<void> {
    await db
      .update(users)
      .set({
        countryCode,
        areaCode,
        phoneNumber,
        phoneVerified: verified,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id));
  }

  async updatePhoneVerified(id: string, verified: boolean): Promise<void> {
    await db
      .update(users)
      .set({
        phoneVerified: verified,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id));
  }

  async save(user: User): Promise<User> {
    const result = await db
      .insert(users)
      .values(DrizzleUserMapper.toDrizzle(user))
      .returning();

    return DrizzleUserMapper.toDomain(result.at(0)!);
  }
}

export { DrizzleUserRepository };
