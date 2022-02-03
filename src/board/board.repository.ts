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

  // commentRepository에서는 잘 싱행되는데 여기서는 잘 안된다... 오류도 안뜬다..
  // async findByBoardId(boardId: string) {
  //   console.log('나실행됨2?' + boardId);
  //   const board = await this.createQueryBuilder()
  //     .select('board')
  //     .from(Board, 'board')
  //     .where('board.id=:id', { id: boardId })
  //     .getOne();
  //   console.log('나실행됨?' + board.title);
  //   return board;
  // }
}
