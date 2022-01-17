import { IsString, MaxLength, MinLength } from 'class-validator';

export class UserFindId {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;
}
