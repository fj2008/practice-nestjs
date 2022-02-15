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
  async createBoard(board: Board): Promise<void> {
    console.log('레파지토리' + board.description);
    await this.createQueryBuilder()
      .insert()
      .into(Board)
      .values(board)
      .execute();
    console.log('저장완료');
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
