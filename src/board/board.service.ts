import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/model/user.entity';
import { BoardRepository } from './board.repository';
import { WritingBoardDto } from './dto/writing.board.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(BoardRepository)
    private boardRepository: BoardRepository,
  ) {}

  async createBoard(writingBoardDto: WritingBoardDto, user: User) {
    const board = await this.boardRepository.createBoard(writingBoardDto, user);
  }
}
