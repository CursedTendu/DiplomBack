import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Subject {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: true })
  title?: string;

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.id)
  teacher: User;
}
