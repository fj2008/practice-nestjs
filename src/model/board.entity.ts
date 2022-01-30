import { BoardStatus } from 'src/board/enum/board.status.enum';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Comment } from './comment.entity';
import { User } from './user.entity';

@Entity()
export class Board {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  description: string;
  @Column()
  status: BoardStatus;
  @Column({ type: 'timestamp' })
  date_time: Date;

  @ManyToOne(() => User, (user) => user.boards)
  user: User;
  @OneToMany(() => Comment, (comment) => comment.board)
  comments: Comment[];
}
