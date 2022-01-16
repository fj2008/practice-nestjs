import { User } from '../model/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { UserAuthDto } from './dto/user.authdto';
import * as bcrypt from 'bcrypt';
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(userAuthDto: UserAuthDto): Promise<void> {
    const { username, password, gender, email } = userAuthDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);
    const user = this.create({
      username,
      password: hashedPassword,
      gender,
      email,
    });
    try {
      await this.save(user);
      console.log('저장완료');
    } catch (error) {
      console.log(error);
    }
  }
}
