import { Board } from 'src/model/board.entity';
import { User } from 'src/model/user.entity';
import {
  EntityManager,
  EntityRepository,
  Repository,
  Transaction,
  TransactionManager,
} from 'typeorm';
import { WritingBoardDto } from './dto/writing.board.dto';
import { BoardStatus } from './enum/board.status.enum';

@EntityRepository(Board)
export class BoardRepository extends Repository<Board> {
  @Transaction()
  async createBoard(
    @TransactionManager() transactionManager: EntityManager,
    writingBoardDto: WritingBoardDto,
    user: User,
  ): Promise<void> {
    const { title, description } = writingBoardDto;
    const board = this.create({
      title,
      description,
      status: BoardStatus.PUBLIC,
      user: user,
    });
    if (board) {
      await transactionManager.save(board);
    }
  }
}
