import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Board } from './board.entity';
import { Comment } from './comment.entity';

@Entity()
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;
  @Column()
  email: string;
  @Column()
  gender: string;
  @Column({ type: 'timestamp' })
  date_time: Date;

  @OneToMany(() => Board, (board) => board.user, { eager: true })
  boards: Board[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}
