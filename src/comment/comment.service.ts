import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from 'src/model/board.entity';
import { Comment } from 'src/model/comment.entity';
import { User } from 'src/model/user.entity';
import { Connection, getConnection } from 'typeorm';
import { CommentRepository } from './comment.repository';
import { CreateCommentDto } from './dto/create.comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentRepository)
    private readonly commentRepository: CommentRepository,
    private connection: Connection,
  ) {}

  async createComment(
    createCommentDto: CreateCommentDto,
    user: User,
    boardId: string,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const boardEntity = await this.commentRepository.findByBoard(boardId);
    const comment = await queryRunner.manager.create(Comment, {
      comments: createCommentDto.comment,
      user,
      board: boardEntity,
    });
    console.log(comment.comments);

    if (comment) {
      await this.commentRepository.createComment(comment);
    }
  }
}
