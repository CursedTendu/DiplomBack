import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Subject } from './subject.entity';
import { User } from './user.entity';

@Entity()
export class SubjectsUser {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @JoinColumn()
  @ManyToOne(() => Subject, (subject) => subject.id)
  subject: Subject;

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.id)
  student: User;
}
