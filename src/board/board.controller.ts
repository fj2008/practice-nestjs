import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/model/user.entity';
import { GetUser } from 'src/user/decorator/get-user.decorator';
import { BoardService } from './board.service';
import { WritingBoardDto } from './dto/writing.board.dto';

@Controller('board')
@UseGuards(AuthGuard())
export class BoardController {
  constructor(private boardService: BoardService) {}

  //글쓰기 api
  @Post('/writing')
  writingBoard(
    @Body() writingBoardDto: WritingBoardDto,
    @GetUser() user: User,
  ): Promise<void> {
    return this.boardService.createBoard(writingBoardDto, user);
  }
}
