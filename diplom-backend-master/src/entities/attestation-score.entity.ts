import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Subject } from './subject.entity';

@Entity()
export class AttestationScore {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  score: 0 | 1 | 2;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn()
  student: User;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn()
  teacher: User;

  @ManyToOne(() => Subject, (user) => user.id)
  @JoinColumn()
  subject: Subject;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
