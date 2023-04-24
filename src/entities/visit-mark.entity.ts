import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  Column,
} from 'typeorm';
import { User } from './user.entity';
import { Link } from './link.entity';
import { Subject } from './subject.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class VisitMark {
  @ApiProperty({
    name: 'id',
    description: 'Первичный ключ ссылки в БД. (Инкремент)',
    example: 1,
  })
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @ApiProperty({
    name: 'student',
    description:
      'Объект пользователя. Связь с таблицей User как Многие-К-Одному',
    type: User,
  })
  @JoinColumn()
  @ManyToOne(() => User, (user) => user.id)
  student?: User;

  @ApiProperty({
    name: 'state',
    description: 'Состояние отметки',
    enum: [0, 1],
    default: 0,
    example: 1,
  })
  @Column({ default: 0 })
  state?: 0 | 1;

  @ApiProperty({
    name: 'teacher',
    description:
      'Объект пользователя. Связь с таблицей User как Многие-К-Одному',
    type: User,
  })
  @JoinColumn()
  @ManyToOne(() => User, (user) => user.id)
  teacher?: User;

  @ApiProperty({
    name: 'link',
    description:
      'Объект пользователя. Связь с таблицей Link как Многие-К-Одному',
    type: Link,
  })
  @JoinColumn()
  @ManyToOne(() => Link, (link) => link.id)
  link?: Link;

  @ApiProperty({
    name: 'student',
    description: 'Объект предмета. Связь с таблицей User как Многие-К-Одному',
    type: User,
  })
  @JoinColumn()
  @ManyToOne(() => Subject, (subject) => subject.id)
  subject?: Subject;
}
