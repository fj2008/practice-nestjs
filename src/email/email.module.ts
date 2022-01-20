import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { EmailService } from './email.service';

@Module({
  imports: [forwardRef(() => UserModule)],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
