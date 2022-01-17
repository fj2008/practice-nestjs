import {
  Body,
  Controller,
  Get,
  Post,
  Redirect,
  Req,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/model/user.entity';
import { GetUser } from './decorator/get-user.decorator';
import { UserSignInAuthDto } from './dto/user.auth.signindto';
import { UserAuthDto } from './dto/user.authdto';
import { UserFindId } from './dto/user.findIddto';
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

  @Post('/findid')
  async findId(@Body() userFindId: UserFindId, user: User) {
    const findedUser = await this.userService.findId(userFindId);
    if (findedUser) {
      console.log(findedUser);
      //아이디찾기를 제대로 하기 위해선....
      //bcrypt로 이미 암호화가 돼 있기때문에 복호화를 할 수 없다.
      //그렇기때문에 비밀번호를 재설정을 해야 하는데
      // @Redireaction(리다이렉션)을 활용해서
      //페이지를 리턴한다음
      //사용자에게 다시 비밀번호를 설정해라고 한 후에
      //그 값을 db에 업데이트를 해야 한다.

      return findedUser;
    } else {
      throw new UnauthorizedException('일치하는 유저 정보가 없습니다.');
    }
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
