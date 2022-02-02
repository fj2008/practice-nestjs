import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardModule } from 'src/board/board.module';
import { BoardRepository } from 'src/board/board.repository';
import { UserModule } from 'src/user/user.module';
import { CommentController } from './comment.controller';
import { CommentRepository } from './comment.repository';
import { CommentService } from './comment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentRepository]),
    UserModule,
    BoardModule,
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
