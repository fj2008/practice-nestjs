import { Board } from 'src/model/board.entity';
import { User } from 'src/model/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { WritingBoardDto } from './dto/writing.board.dto';
import { BoardStatus } from './enum/board.status.enum';

@EntityRepository(Board)
export class BoardRepository extends Repository<Board> {
  async createBoard(writingBoardDto: WritingBoardDto, user: User) {
    const { title, description } = writingBoardDto;
    const board = this.create({
      title,
      description,
      status: BoardStatus.PUBLIC,
      user: user,
    });
    await this.save(board);
  }
}
