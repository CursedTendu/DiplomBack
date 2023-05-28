import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
  OneToOne,
  ManyToOne,
} from 'typeorm';
import { UserType, userTypeArray } from '../common/types';
import { Link } from './link.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Group } from './groups.entity';

@Entity()
export class User {
  @ApiProperty({
    name: 'id',
    description: 'Первичный ключ пользователя (uuid)',
    example: '10effc67-06db-42b2-a604-0ee4d0b76bde',
  })
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @ApiProperty({
    name: 'createdAt',
    description: 'Дата создания записи пользователя в нашей системе',
    example: new Date().toISOString(),
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    name: 'createdAt',
    description: 'Дата обновления записи пользователя в нашей системе',
    example: new Date().toISOString(),
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    name: 'id',
    description: 'Идентификатор пользователя в системе ЭИОС КемГУ',
    type: Number,
    example: 12345,
    required: true,
  })
  @Column({ nullable: false })
  userId?: number;

  @ApiProperty({
    name: 'login',
    description: 'Логин пользователя в системе ЭИОС КемГУ',
    type: String,
    example: 'stud12345',
    required: true,
  })
  @Column({ nullable: true })
  login?: string | null;

  @ApiProperty({
    name: 'firstName',
    description: 'Имя пользователя в системе ЭИОС КемГУ',
    type: String,
    example: 'Иван',
    required: false,
  })
  @Column({ nullable: true })
  firstName?: string | null;

  @ApiProperty({
    name: 'lastName',
    description: 'Фамилия пользователя в системе ЭИОС КемГУ',
    type: String,
    example: 12345,
    required: false,
  })
  @Column({ nullable: true })
  lastName?: string | null;

  @ApiProperty({
    name: 'middleName',
    description: 'Отчество пользователя в системе ЭИОС КемГУ',
    type: Number,
    example: 12345,
    required: false,
  })
  @Column({ nullable: true })
  middleName?: string | null;

  @ApiProperty({
    name: 'email',
    description: 'Почта пользователя в системе ЭИОС КемГУ',
    type: String,
    example: 'user@example.com',
    required: false,
  })
  @Column({ nullable: true })
  email?: string | null;

  @ApiProperty({
    name: 'phone',
    description: 'Номер телефона пользователя в системе ЭИОС КемГУ',
    type: String,
    example: '+79953451234',
    required: false,
  })
  @Column({ nullable: true })
  phone?: string | null;

  @ApiProperty({
    name: 'blocked',
    description: 'Флаг блокировки пользователя в системе ЭИОС КемГУ',
    enum: [0, 1],
    example: 12345,
    required: false,
  })
  @Column()
  blocked?: 0 | 1;

  @ApiProperty({
    name: 'userType',
    description: 'Тип пользователя в системе ЭИОС КемГУ',
    enum: userTypeArray,
    example: 12345,
    required: true,
  })
  @Column()
  userType?: UserType;

  @ApiProperty({
    name: 'link',
    description: 'Список ссылок, созданных пользователем.',
    isArray: true,
    type: Link,
  })
  @JoinColumn()
  @OneToMany(() => Link, (link) => link.id)
  link: Link;

  @ApiProperty({
    name: 'group',
    description: 'Группа пользователя, если это студент',
  })
  @ManyToOne(() => Group, (group) => group.id)
  @JoinColumn()
  group: Group;
}
