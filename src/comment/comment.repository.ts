import { Board } from 'src/model/board.entity';
import { Comment } from 'src/model/comment.entity';
import { User } from 'src/model/user.entity';
import {
  EntityManager,
  EntityRepository,
  Repository,
  Transaction,
  TransactionManager,
} from 'typeorm';
import { CreateCommentDto } from './dto/create.comment.dto';

@EntityRepository(Comment)
export class CommentRepository extends Repository<Comment> {
  @Transaction()
  async createComment(
    @TransactionManager() manager: EntityManager,
    createCommentDto: CreateCommentDto,
    user: User,
    boardId: string,
  ) {
    const findboard = await manager.findOne(Board, boardId);
    const comment = await manager.create(Comment, {
      comments: createCommentDto.comment,
      user: user,
      board: findboard,
    });
    if (comment) {
      manager.save(comment); //save에 파라메터로 옵션넘겨 줄 수 있는데 어떤옵션이 있는지 찾아보기.
    }
  }
}
