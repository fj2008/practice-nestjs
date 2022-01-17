import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserGender } from '../enum/user.gender.enum';

export class UserAuthDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: '패스워드는 숫자와 영어만 사용하실 수 있습니다.',
  })
  password: string;

  @IsString()
  gender: UserGender;

  @IsEmail()
  email: string;
}
