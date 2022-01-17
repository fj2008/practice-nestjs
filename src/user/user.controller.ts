import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/model/user.entity';
import { GetUser } from './decorator/get-user.decorator';
import { UserSignInAuthDto } from './dto/user.auth.signindto';
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

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) uerSingInAuthDto: UserSignInAuthDto,
  ): Promise<{ accsessToken: string }> {
    return this.userService.signIn(uerSingInAuthDto);
  }

  @Get('')
  test() {
    return '나됨?';
  }
  //@UseGuards(AuthGuard())
  //validate 메서드에서 return값을 user객체로 줬다. 그래서 요청값아네 user객체가 들어있게하기위해서사용
  //useGuard안에 authguard를 넣으면 요청안에 유저정보를 넣어줄 수 있다.
  @Post('/test')
  @UseGuards(AuthGuard())
  test1(@GetUser() user: User) {
    console.log('user', user);
  }
}
