import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from 'src/model/board.entity';
import { User } from 'src/model/user.entity';
import { Connection } from 'typeorm';
import { BoardRepository } from './board.repository';
import { WritingBoardDto } from './dto/writing.board.dto';
import { BoardStatus } from './enum/board.status.enum';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(BoardRepository)
    private boardRepository: BoardRepository,
    private connection: Connection,
  ) {}

  //글쓰기api에 대한 서비스
  async createBoard(
    writingBoardDto: WritingBoardDto,
    user: User,
  ): Promise<void> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      console.log('실행됨?!1');
      const board = queryRunner.manager.create(Board, {
        title: writingBoardDto.title,
        description: writingBoardDto.description,
        status: BoardStatus.PUBLIC,
        user: user,
      });
      if (board) {
        console.log('나실행됨?' + board.description);
        await this.boardRepository.createBoard(board);
        await queryRunner.commitTransaction();
      } else {
        console.log('게시글추가 실패');
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  //하나의 글 수정api에 대한 서비스
  async updateBoard(
    boardId: string,
    writingBoardDto: WritingBoardDto,
  ): Promise<void> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const { title, description } = writingBoardDto;
    const board = await this.boardRepository.findOne(boardId);
    try {
      await queryRunner.manager.update(Board, board.id, { title, description });
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  //하나의 글 삭제api에 대한 서비스
  async deleteBoard(boardId: string) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const board = await this.boardRepository.findOne(boardId);
    try {
      await queryRunner.manager.delete(Board, board.id);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
