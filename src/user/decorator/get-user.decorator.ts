import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/model/user.entity';

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest(); //요청정보들을 req에 담는다
    return req.user;
  },
);
