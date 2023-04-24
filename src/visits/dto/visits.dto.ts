import { ApiProperty } from '@nestjs/swagger';

export class CreateMarkSession {
  @ApiProperty({
    name: 'ttl',
    description:
      'Время жизни ссылки для отметки. Если не передать значение ttl в тело запроса, по умолчанию ссылка будет иметь длительность в 180000 миллисекунд (3 минуты)',
    default: 180000,
    example: 360000,
    required: false,
  })
  ttl?: number;
  @ApiProperty({
    name: 'marketAt',
    description:
      'Необязательное свойств времени начала отметки. Добавлено для случая, когда нужно отметить студентов не в текущий момент времени. Если не передать значение markedAt в тело запроса, по умолчанию ссылка будет иметь время отметки текущее',
    example: new Date().toISOString(),
    required: false,
  })
  markedAt?: string; // ISO String Format
  @ApiProperty({
    name: 'subjectId',
    description:
      'Идентификатор предмета в системе. Также в БД имеется таблица subjects_user с ключами предмета и студента',
    example: 1,
    required: true,
  })
  subjectId: number;
}

export class SetMarkStateDto {
  @ApiProperty({
    name: 'state',
    description:
      'Состояние отметки: при отметке можно передать или значение true, или значение false. В зависимости от переданного значения, студент имеет возможность как отметиться, так и снять отметку. Снятие может быть полезным для преподавателя, а отметиться можно только за отведенное время жизни ссылки',
    example: true,
    required: true,
  })
  state: boolean;
  @ApiProperty({
    name: 'linkId',
    description:
      'Идентификатор ссылки, созданной преподавателем. Можно будет получить, создав ссылку через API или перейти по QR-коду',
    example: 'sdigjsdklfg',
    required: true,
  })
  linkId: string;
  @ApiProperty({
    name: 'userId',
    description:
      'Идентификатор пользователя. В будущем пользователь будет определяться по токену',
    example: '10effc67-06db-42b2-a604-0ee4d0b76bde',
    required: true,
  })
  userId: string;
}
