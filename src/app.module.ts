import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailService } from './email/email.service';
import { EmailModule } from './email/email.module';
import { MailerModule } from '@nestjs-modules/mailer';
import * as path from 'path';
import configEmail from './config/email';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './.env',
      load: [configEmail],
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    UserModule,
    EmailModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        console.log('===== write [.env] by config: network====');
        console.log(config.get('email'));
        return {
          ...config.get('email'),
          template: {
            dir: path.join(__dirname, '/templates/'),
            adapter: new EjsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],
  providers: [EmailService],
  controllers: [],
})
export class AppModule {}
