import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { BoardStatus } from '../enum/board.status.enum';

export class WritingBoardDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
