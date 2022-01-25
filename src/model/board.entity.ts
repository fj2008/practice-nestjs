import { BoardStatus } from 'src/board/enum/board.status.enum';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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

  @ManyToOne((type) => User, (user) => user.boards, { eager: false })
  user: User;
}
