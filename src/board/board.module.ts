import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardRepository } from './board.repository';
import { UserModule } from 'src/user/user.module';
import { Repository } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([BoardRepository]), UserModule],
  providers: [BoardService, BoardRepository],
  controllers: [BoardController],
  exports: [BoardRepository],
})
export class BoardModule {}
