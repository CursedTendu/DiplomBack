import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VisitMark } from './visit-mark.entity';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Link {
  @ApiProperty({
    name: 'id',
    description: 'Первичный ключ ссылки в БД. (Инкремент)',
    example: 1,
  })
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @ApiProperty({
    name: 'linkId',
    description:
      'Идентификатор ссылки. Нужен для перехода по ссылки. Грубо говоря, это алиас первичного ключа',
    example: 'JhLKJhfsdkj',
  })
  @Column()
  linkId?: string;

  @ApiProperty({
    name: 'mark',
    description:
      'Список отметок студентов. В БД столбец определяется как вторичный ключ отметки',
    isArray: true,
  })
  @JoinColumn()
  @OneToMany(() => VisitMark, (mark) => mark.id)
  mark?: VisitMark;

  @ApiProperty({
    name: 'createdAt',
    description:
      'Дата создания ссылки. Генерируется автоматически на стороне БД',
    example: new Date().toISOString(),
  })
  @CreateDateColumn()
  createdAt?: Date;

  @ApiProperty({
    name: 'creator',
    description:
      'Объект пользователя, который создал ссылку. В БД определяется как вторичный ключ к таблице User (Многие-К-Одному)',
    type: User,
  })
  @JoinColumn()
  @ManyToOne(() => User, (user) => user.id)
  creator?: User;

  @ApiProperty({
    name: 'marketAt',
    description:
      'Необязательное свойств времени начала отметки. Добавлено для случая, когда нужно отметить студентов не в текущий момент времени. Если не передать значение markedAt в тело запроса, по умолчанию ссылка будет иметь время отметки текущее',
    example: new Date().toISOString(),
    required: false,
  })
  @Column({ nullable: true })
  markedAt?: Date;

  @ApiProperty({
    name: 'ttl',
    description:
      'Время жизни ссылки для отметки. Если не передать значение ttl в тело запроса, по умолчанию ссылка будет иметь длительность в 180000 миллисекунд (3 минуты)',
    default: 180000,
    example: 360000,
    required: false,
  })
  @Column({ default: 180000 })
  ttl?: number; // in milliseconds
}
