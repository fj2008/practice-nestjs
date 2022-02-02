import { Comment } from 'src/model/comment.entity';
import {
  EntityRepository,
  getConnection,
  Repository,
  Transaction,
} from 'typeorm';

@EntityRepository(Comment)
export class CommentRepository extends Repository<Comment> {
  @Transaction()
  async createComment(comment: Comment) {
    await this.createQueryBuilder()
      .insert()
      .into(Comment)
      .values(comment)
      .execute();
  }
}
