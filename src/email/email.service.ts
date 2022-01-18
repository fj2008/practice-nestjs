import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { EmailDto } from 'src/user/dto/emaildto';
@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async _send(
    tos: string[],
    subject: string,
    templateName: string,
    context: any = {},
  ): Promise<boolean> {
    await this.mailerService.sendMail({
      to: tos.join(', '),
      subject,
      template: `./src/templates/${templateName}`,
      context,
    });

    return true;
  }

  // async signin(to: string) {
  //   await this._send([to], '로그인 시도', 'auth.ejs', {
  //     email: to,
  //     datetime: new Date(),
  //   });
  // }

  async signup(to: string) {
    await this._send([to], '회원가입 완료', 'signup.ejs', {
      email: to,
    });
  }

  async auther(emailDto: EmailDto) {
    console.log(emailDto.email);
    const random = Math.random().toString();
    const authNum = random.split('.')[1]; // 난수생성

    await this._send([emailDto.email], '이메일 인증 시도', 'auth.ejs', {
      email: emailDto.email,
      auth: authNum,
      datetime: new Date(),
    });
  }
}
