import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
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
  @OneToOne(() => User, (user) => user.id)
  teacher: User;
}
