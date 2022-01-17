import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UserAuthDto } from './dto/user.authdto';
import { UserSignInAuthDto } from './dto/user.auth.signindto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import e from 'express';
import { UserFindId } from './dto/user.findIddto';
import { User } from 'src/model/user.entity';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(userAuthDto: UserAuthDto): Promise<void> {
    return this.userRepository.createUser(userAuthDto);
  }

  async signIn(
    userSignInAuthDto: UserSignInAuthDto,
  ): Promise<{ accsessToken: string }> {
    const { username, password } = userSignInAuthDto;
    const user = await this.userRepository.findOne({ username });
    if (user && bcrypt.compare(password, user.password)) {
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
}
