import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Board } from './board.entity';

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
  @OneToMany((type) => Board, (board) => board.user, { eager: true })
  boards: Board[];
}
