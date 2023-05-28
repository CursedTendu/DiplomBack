import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Group } from './groups.entity';
import { User } from './user.entity';

@Entity()
export class GroupUsers {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => Group, (group) => group.id)
  @JoinColumn()
  group: Group;

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn()
  student: User;
}
