import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { UserAuthDto } from './dto/user.authdto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  // 회원가입 api
  @Post('/signup')
  signUp(@Body(ValidationPipe) userAuthDto: UserAuthDto): Promise<void> {
    return this.userService.signUp(userAuthDto);
  }

  @Get('')
  test() {
    return '나됨?';
  }
}
