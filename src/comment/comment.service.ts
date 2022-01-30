import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/model/comment.entity';
import { User } from 'src/model/user.entity';
import { Connection } from 'typeorm';
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
    await this.commentRepository.createComment(
      queryRunner.manager,
      createCommentDto,
      user,
      boardId,
    );
  }
}
