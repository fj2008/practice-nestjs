import { Board } from 'src/model/board.entity';
import { Comment } from 'src/model/comment.entity';
import {
  EntityRepository,
  getConnection,
  Repository,
  Transaction,
} from 'typeorm';

@EntityRepository(Comment)
export class CommentRepository extends Repository<Comment> {
  async findByBoard(boardId: string) {
    const board = await this.createQueryBuilder()
      .select('board')
      .from(Board, 'board')
      .where('board.id=:id', { id: boardId })
      .getOne();
    console.log(board);
    return board;
  }

  async createComment(comment: Comment) {
    await this.createQueryBuilder()
      .insert()
      .into(Comment)
      .values(comment)
      .execute();
  }
}
