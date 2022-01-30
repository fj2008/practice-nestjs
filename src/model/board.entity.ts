import { BoardStatus } from 'src/board/enum/board.status.enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Comment } from './comment.entity';
import { User } from './user.entity';

@Entity('board')
export class Board {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  title: string;
  @Column({ nullable: true })
  description: string;
  @Column({ nullable: true })
  status: BoardStatus;
  @Column({ type: 'timestamp', nullable: true })
  date_time: Date;

  @ManyToOne(() => User, (user) => user.boards)
  @JoinColumn({ name: 'userId' })
  user: User;
  @OneToMany(() => Comment, (comment) => comment.board)
  comments: Comment[];
}
