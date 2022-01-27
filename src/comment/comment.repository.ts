import { Comment } from 'src/model/comment.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Comment)
export class CommentRepository extends Repository<Comment> {}
