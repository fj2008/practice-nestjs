import {
  Body,
  Controller,
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

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) uerSingInAuthDto: UserSignInAuthDto,
  ): Promise<{ accsessToken: string }> {
    return this.userService.signIn(uerSingInAuthDto);
  }

  @Post('/findid')
  async findId(@Body() userFindId: UserFindId) {
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
  //db에 등록된이메일인지 체크후 인증메일 요청
  @Post('/auth/mail')
  async authmail(@Body() emailDto: EmailDto) {
    return this.userService.cheakEmail(emailDto);
  }

  //이메일 인증을 한후 비밀번호를 수정버튼을 눌렀을때 들어오는 컨트롤러
  @Get('/auth/:checkUser')
  authPage(@Param('checkUser') checkUser: string) {
    console.log('파라미터값' + checkUser);
    return this.userService.cheak(checkUser);
  }

  // //인증번호 확인을 눌렀을때 발생되는 버튼이벤트 컨트롤러
  // @Post('/auth/authNum')
  // @Redirect('/user/auth/updateView')
  // authNum(@Body() authNum: string) {
  //   return this.userService.checkAuthUser(authNum);
  // }

  @Get('/auth/updateView')
  @Render('authUpdatePw')
  async updatePwView() {
    const userId = await this.userService.findUserId();

    return { userId };
  }

  @Patch('/auth/update/:userId')
  async updatePw(
    @Body() updatePwDto: UpdatePwDto,
    @Param('userId') userId: string,
  ) {
    console.log('업데이트 해주세요' + userId);
    return this.userService.updatePw(updatePwDto, userId);
  }
}

// const file = createReadStream(
//   join(process.cwd(), './src/templates/authUpdatePw.ejs'),
// );
// return new StreamableFile(file);
