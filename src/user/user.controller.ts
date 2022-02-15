import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Redirect,
  Render,
  Req,
  Res,
  Session,
  StreamableFile,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { EmailService } from 'src/email/email.service';
import { User } from 'src/model/user.entity';
import { GetUser } from './decorator/get-user.decorator';
import { EmailDto } from './dto/emaildto';
import { UserSignInAuthDto } from './dto/user.auth.signindto';
import { UpdatePwDto } from './dto/user.auth.updatepwdto';
import { UserAuthDto } from './dto/user.authdto';
import { UserFindId } from './dto/user.findIddto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private emailService: EmailService,
  ) {}

  // 회원가입 api
  @Post('/signup')
  signUp(@Body(ValidationPipe) userAuthDto: UserAuthDto): Promise<void> {
    return this.userService.signUp(userAuthDto);
  }
  //로그인 api
  @Post('/signin')
  signIn(
    @Body(ValidationPipe) uerSingInAuthDto: UserSignInAuthDto,
  ): Promise<{ accsessToken: string }> {
    return this.userService.signIn(uerSingInAuthDto);
  }

  @Get()
  test() {
    return '';
  }
  //@UseGuards(AuthGuard())
  //validate 메서드에서 return값을 user객체로 줬다. 그래서 요청값아네 user객체가 들어있게하기위해서사용
  //useGuard안에 authguard를 넣으면 요청안에 유저정보를 넣어줄 수 있다.
  @Post('/test')
  @UseGuards(AuthGuard())
  test1(@GetUser() user: User) {
    console.log('user', user);
  }
  //db에 등록된이메일인지 체크후 인증메일 요청
  @Post('/auth/mail')
  async authmail(@Body(ValidationPipe) emailDto: EmailDto) {
    return this.userService.cheakEmail(emailDto);
  }

  //이메일 인증을 한후 비밀번호를 수정버튼을 눌렀을때 들어오는 컨트롤러
  @Get('/auth/:checkUser')
  authPage(@Param('checkUser') checkUser: string) {
    console.log('파라미터값' + checkUser);
    return this.userService.cheak(checkUser);
  }

  @Get('/auth/updateView')
  @Render('authUpdatePw')
  async updatePwView() {
    const userId = await this.userService.findUserId();

    return { userId };
  }

  @Patch('/auth/update/:userId')
  async updatePw(
    @Body(ValidationPipe) updatePwDto: UpdatePwDto,
    @Param('userId') userId: string,
  ) {
    console.log('업데이트 해주세요' + userId);
    return this.userService.updatePw(updatePwDto, userId);
  }

  //회원탈퇴
  @Delete('/:userId')
  deleteUser(@Param('userId') userId: string) {
    return this.userService.deleteUser(userId);
  }
}
// 파일 리턴할때 사용하는 로직
// const file = createReadStream(
//   join(process.cwd(), './src/templates/authUpdatePw.ejs'),
// );
// return new StreamableFile(file);
