import { Controller, Get } from '@nestjs/common';

@Controller('comment')
export class CommentController {
  @Get()
  testComment() {
    return '안녕하다';
  }
}
