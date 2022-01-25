import { CacheModule, forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from 'nestjs-ioredis';

import { EmailModule } from 'src/email/email.module';
import { JwtStrtegy } from './auth/config/jwt.strategy';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [
    CacheModule.register(),
    ConfigModule.forRoot(),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: 60 * 60,
      },
    }),
    forwardRef(() => EmailModule),
    TypeOrmModule.forFeature([UserRepository]), // orm,
    RedisModule.forRoot([
      {
        host: process.env.REDIS_HOST,
        port: 6379,
        password: process.env.REDIS_PW,
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrtegy],
  exports: [JwtStrtegy, PassportModule], // 다른 모듈에서도 사용하게하기위해서 exports에 등록
})
export class UserModule {}
