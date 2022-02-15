import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/model/user.entity';
import { GetUser } from 'src/user/decorator/get-user.decorator';
import { BoardService } from './board.service';
import { WritingBoardDto } from './dto/writing.board.dto';

@Controller('board')
export class BoardController {
  constructor(private boardService: BoardService) {}

  //글쓰기 api
  @Post('/writing')
  @UseGuards(AuthGuard())
  writingBoard(
    @Body(ValidationPipe) writingBoardDto: WritingBoardDto,
    @GetUser() user: User,
  ): Promise<void> {
    return this.boardService.createBoard(writingBoardDto, user);
  }

  //글 수정하기 api
  @Patch('/update/description/:boardId')
  @UseGuards(AuthGuard('jwt'))
  updateDescription(
    @Param('boardId') boardId: string,
    @Body(ValidationPipe) writingBoardDto: WritingBoardDto,
  ): Promise<void> {
    return this.boardService.updateBoard(boardId, writingBoardDto);
  }
  //글 삭제 하기 api
  @Delete('/delete/:boardId')
  @UseGuards(AuthGuard('jwt'))
  deleteBoard(@Param('boardId') boardId: string) {
    return this.boardService.deleteBoard(boardId);
  }
}
