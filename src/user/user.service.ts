import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  StreamableFile,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UserAuthDto } from './dto/user.authdto';
import { UserSignInAuthDto } from './dto/user.auth.signindto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRedisClient } from 'nestjs-ioredis';
import * as Redis from 'ioredis';

import { UserFindId } from './dto/user.findIddto';
import { User } from 'src/model/user.entity';
import { EmailDto } from './dto/emaildto';
import { EmailService } from 'src/email/email.service';
import { UpdatePwDto } from './dto/user.auth.updatepwdto';
import { Cache } from 'cache-manager';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Connection, getConnection, getManager } from 'typeorm';
import { FluentConfig } from 'src/utils/fluentd';
import { FluentClient } from '@fluent-org/logger';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
    @InjectRedisClient('0')
    private cache: Redis.Redis,
    private emailService: EmailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private connection: Connection,
  ) {
    this.logger = new FluentConfig().ConfigFlunt();
  }
  private logger: FluentClient;
  async signUp(userAuthDto: UserAuthDto): Promise<void> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(userAuthDto.password, salt);
      const user = queryRunner.manager.create(User, {
        username: userAuthDto.username,
        password: hashedPassword,
        gender: userAuthDto.gender,
        email: userAuthDto.email,
      });
      await this.userRepository.createUser(user);
      await queryRunner.commitTransaction(); //????????????
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async signIn(
    userSignInAuthDto: UserSignInAuthDto,
  ): Promise<{ accsessToken: string }> {
    const { username, password } = userSignInAuthDto;
    const user = await this.userRepository.findOne({
      where: { username: username },
    });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { username };
      const accsessToken = await this.jwtService.sign(payload); //????????????
      return { accsessToken };
    } else {
      this.logger.emit('error', {
        date: '??? ???????????? ??????????????? ec2????????? ?????? ??????????',
      });
      // new FluentConfig().serviceConfigFlunt('error', { err: 'err??????.' });
      throw new UnauthorizedException('????????? ??????');
    }
  }

  // async logout(user: User) {
  //   const
  // }

  async findId(userFindId: UserFindId): Promise<User> {
    const { username } = userFindId;
    const user = await this.userRepository.findOne({ username });
    if (user) {
      return user;
    } else {
      throw new UnauthorizedException('?????? ??????????????? ????????????.');
    }
  }

  //????????????????????? ????????????????????? ?????? ???????????? ???????????? ??????????????? ??????
  async cheakEmail(emailDto: EmailDto): Promise<void> {
    const { email } = emailDto;
    const authUser = await this.userRepository.findOne({ email });
    if (authUser) {
      const random = Math.random().toString();
      const salt = await bcrypt.genSalt();
      const hashedAuthNum = await (await bcrypt.hash(random, salt))
        .replace('?', 'B')
        .replace('/', 'B');

      console.log('????????? ???????:' + hashedAuthNum);
      // await this.emailService._send(
      //   [emailDto.email],
      //   '????????? ?????? ??????',
      //   'auth.ejs',
      //   {
      //     email: emailDto.email,
      //     auth: hashedAuthNum,
      //     datetime: new Date(),
      //   },
      // );
      console.log('?????? ?????????');
      await this.cache.set('authkey', `${hashedAuthNum}`);
      await this.cache.set('userId', `${authUser.id}`);
    } else {
      throw new UnauthorizedException('????????? ????????? ????????????.');
    }
  }

  //???????????? ????????? ????????? ??????????????? ????????? ?????? ???????????? ????????? ?????????
  async findUserId() {
    return await this.cache.get('userId');
  }

  //????????? ?????? ???????????? ???????????? ????????? ????????? ??????
  async updatePw(updatePwDto: UpdatePwDto, userId: string) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const userEntity = await this.userRepository.findOne({
        where: { id: userId },
      });
      console.log(userEntity);
      const { password } = updatePwDto;
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      console.log('?????? ????????????' + hashedPassword);

      await this.userRepository.updatePw(userId, hashedPassword);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  //url??? ???????????? ???????????? ??????
  async cheak(checkUser: string) {
    const authHash = await this.cache.get('authkey');
    console.log(checkUser);
    console.log(authHash);
    console.log(checkUser === authHash);
    if (checkUser === authHash) {
      const file = createReadStream(
        join(process.cwd(), './src/templates/authUpdatePw.ejs'),
      );
      return new StreamableFile(file);
    } else {
      throw new UnauthorizedException('???????????? ?????? ?????????');
    }
  }

  deleteUser(userId: string) {
    this.userRepository.deleteByUserId(userId);
  }
}
