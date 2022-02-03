import { User } from '../model/user.entity';
import {
  EntityManager,
  EntityRepository,
  Repository,
  Transaction,
  TransactionManager,
  TransactionRepository,
} from 'typeorm';
import { UserAuthDto } from './dto/user.authdto';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { string } from 'mathjs';
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(user: User): Promise<void> {
    try {
      await this.createQueryBuilder()
        .insert()
        .into(User)
        .values(user)
        .execute();
      console.log('저장완료');
    } catch (error) {
      console.log(error);
    }
  }

  async findByUserId(userId: string) {
    console.log('userid = ' + userId);
    const userEntity = await this.createQueryBuilder()
      .select()
      .from(User, 'user')
      .where('user.id=:id', { id: userId })
      .getOne();
    console.log('완료');
    if (!userEntity) {
      throw new UnauthorizedException('존제하지 않는 유저입니다.');
    }
  }

  async updatePw(userId: string, password: string) {
    await this.createQueryBuilder()
      .update(User)
      .set({ password: password })
      .where('id=:id', { id: userId })
      .execute();
    console.log('수정완료');
  }
  async deleteByUserId(userId: string) {
    await this.createQueryBuilder()
      .delete()
      .from(User)
      .where('id =:id', { id: userId })
      .execute();
  }
}
