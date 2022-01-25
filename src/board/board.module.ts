import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardRepository } from './board.repository';
import { JwtStrtegy } from 'src/user/auth/config/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { UserRepository } from 'src/user/user.repository';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([BoardRepository]), UserModule],
  providers: [BoardService],
  controllers: [BoardController],
})
export class BoardModule {}
