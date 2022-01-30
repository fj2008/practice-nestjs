import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Board } from './board.entity';
import { Comment } from './comment.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, unique: true })
  username: string;

  @Column({ nullable: true })
  password: string;
  @Column({ nullable: true })
  email: string;
  @Column({ nullable: true })
  gender: string;
  @Column({ type: 'timestamp' })
  date_time: Date;

  @OneToMany(() => Board, (board) => board.user, { eager: true })
  boards: Board[];

  @OneToMany(() => Comment, (comment) => comment.user, { eager: true })
  comments: Comment[];
}
