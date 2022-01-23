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
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
    @InjectRedisClient('0')
    private cache: Redis.Redis,
    private emailService: EmailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async signUp(userAuthDto: UserAuthDto): Promise<void> {
    return this.userRepository.createUser(userAuthDto);
  }

  async signIn(
    userSignInAuthDto: UserSignInAuthDto,
  ): Promise<{ accsessToken: string }> {
    const { username, password } = userSignInAuthDto;
    const user = await this.userRepository.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { username };
      const accsessToken = await this.jwtService.sign(payload); //토큰생성
      return { accsessToken };
    } else {
      throw new UnauthorizedException('로그인 실패');
    }
  }
  async findId(userFindId: UserFindId): Promise<User> {
    const { username } = userFindId;
    const user = await this.userRepository.findOne({ username });
    if (user) {
      return user;
    } else {
      throw new UnauthorizedException('해당 유저정보가 없습니다.');
    }
  }

  //아이디찾기할때 이메일인증시에 해당 이메일이 우리유저 이메일인지 검사
  async cheakEmail(emailDto: EmailDto): Promise<void> {
    const { email } = emailDto;
    const authUser = await this.userRepository.findOne({ email });
    if (authUser) {
      const random = Math.random().toString();
      const salt = await bcrypt.genSalt();
      const hashedAuthNum = await (await bcrypt.hash(random, salt))
        .replace('?', 'B')
        .replace('/', 'B');

      console.log('해쉬된 번호?:' + hashedAuthNum);
      // await this.emailService._send(
      //   [emailDto.email],
      //   '이메일 인증 시도',
      //   'auth.ejs',
      //   {
      //     email: emailDto.email,
      //     auth: hashedAuthNum,
      //     datetime: new Date(),
      //   },
      // );
      console.log('메일 보내짐');
      await this.cache.set('authkey', `${hashedAuthNum}`);
      await this.cache.set('userId', `${authUser.id}`);
    } else {
      throw new UnauthorizedException('저희의 회원이 아닙니다.');
    }
  }

  // //이메일에서 인증하기 버튼을 눌렀을때
  // //radis에 저장된 벨류값이랑 전해들어온 파라미터값이랑 비교하는 함수
  // async checkAuthUser(authUrl: string) {
  //   const authkey = await this.cache.get('authkey');
  //   //form데이터로 들어온 인증번호 데이터 파싱(오브젝트로 들어옴)
  //   const parseObject = JSON.stringify(authUrl).split(':')[1];
  //   const parseNum = parseObject.split('"')[1];
  //   console.log(parseNum);
  //   console.log(authkey);
  //   console.log(authkey === parseNum);
  //   if (authkey === parseNum) {
  //     return '인가된 사용자 ';
  //   } else {
  //     throw new UnauthorizedException('맞지않은 인증번호');
  //   }
  // }

  //비밀번호 수정을 요청한 사용자에게 캐싱된 해당 사용자의 아이디 던지기
  async findUserId() {
    return await this.cache.get('userId');
  }

  //인증을 마친 유저에게 비밀번호 수정을 해주는 함수
  async updatePw(updatePwDto: UpdatePwDto, userId: string) {
    const user = await this.userRepository.findOne(userId);
    const { password } = updatePwDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('바뀐 비밀번호' + hashedPassword);

    if (user) {
      return await this.userRepository.update(user.id, {
        password: hashedPassword,
      });
    }
  }

  //url로 비교해서 인증하는 방식
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
      throw new UnauthorizedException('인증되지 않은 사용자');
    }
  }
}
