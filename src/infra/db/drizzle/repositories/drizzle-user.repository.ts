import { UserRepository } from '@/domain/users/repositories/user.repository';
import { User } from '@/domain/users/entities/user';
import { db } from '..';
import { users } from '../schema';
import { eq } from 'drizzle-orm';
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
  async save(user: User): Promise<User> {
    const result = await db
      .insert(users)
      .values(DrizzleUserMapper.toDrizzle(user))
      .returning();

    return DrizzleUserMapper.toDomain(result.at(0)!);
  }
}

export { DrizzleUserRepository };
