import { UserRepository } from '@/domain/users/repositories/user.repository';
import { User } from '@/domain/users/entities/user';
import { db } from '..';
import { users } from '../schema';
import { eq } from 'drizzle-orm';
import { DrizzleMapper } from '../mapper/drizzle.mapper';

class DrizzleUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = (
      await db.select().from(users).where(eq(users.email, email))
    ).at(0);

    return user ? DrizzleMapper.toDomain(user) : null;
  }
  async findById(id: string): Promise<User | null> {
    const user = (await db.select().from(users).where(eq(users.id, id))).at(0);

    return user ? DrizzleMapper.toDomain(user) : null;
  }
  async save(user: User): Promise<User> {
    const result = await db
      .insert(users)
      .values(DrizzleMapper.toDrizzle(user))
      .returning()
      .execute();
    console.log('result', result);
    return DrizzleMapper.toDomain(result.at(0)!);
  }
}

export { DrizzleUserRepository };
