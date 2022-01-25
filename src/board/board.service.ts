import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/model/user.entity';
import { Connection } from 'typeorm';
import { BoardRepository } from './board.repository';
import { WritingBoardDto } from './dto/writing.board.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(BoardRepository)
    private boardRepository: BoardRepository,
    private connection: Connection,
  ) {}

  async createBoard(
    writingBoardDto: WritingBoardDto,
    user: User,
  ): Promise<void> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    await this.boardRepository.createBoard(
      queryRunner.manager,
      writingBoardDto,
      user,
    );
  }
}
