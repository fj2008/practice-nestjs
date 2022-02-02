import { Board } from 'src/model/board.entity';
import { User } from 'src/model/user.entity';
import {
  EntityManager,
  EntityRepository,
  getConnection,
  getManager,
  getRepository,
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
    console.log('title: ' + title);
    const board = transactionManager.create(Board, {
      title,
      description,
      status: BoardStatus.PUBLIC,
      user: user,
    });
    console.log(board.user.id);
    if (board) {
      await transactionManager.save(board);
    }
  }

  @Transaction()
  async findByBoardId(boardId: string): Promise<Board> {
    console.log('나실행됨2?' + boardId);
    const boardEntity = this.createQueryBuilder()
      .select('board')
      .from(Board, 'board')
      .where('board.id=:id', { id: boardId })
      .getOne();

    console.log(boardEntity);
    return boardEntity;
  }
}
