import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Board } from './board.entity';
import { User } from './user.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  comments: string;

  @Column({ type: 'timestamp' })
  date_time: Date;

  @ManyToOne((type) => User, (user) => user.comments)
  user: User;

  @ManyToOne((type) => Board, (board) => board.comments)
  board: Board;
}
