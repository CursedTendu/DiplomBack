import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Group } from './groups.entity';

@Entity()
export class Subject {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: true })
  title?: string;

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.id)
  teacher: User;

  @ManyToOne(() => Group, (group) => group.id)
  @JoinColumn()
  group: Group;
}
