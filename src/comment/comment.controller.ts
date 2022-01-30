import {
  Body,
  Controller,
  Get,
  ValidationPipe,
  Post,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/model/user.entity';
import { GetUser } from 'src/user/decorator/get-user.decorator';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create.comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}
  @Get()
  testComment() {
    return '안녕하다';
  }

  @Post('/create/:boardId')
  @UseGuards(AuthGuard('jwt'))
  createComment(
    @Body(ValidationPipe) createCommentDto: CreateCommentDto,
    @GetUser() user: User,
    @Param('boardId') boardId: string,
  ) {
    return this.commentService.createComment(createCommentDto, user, boardId);
  }
}
