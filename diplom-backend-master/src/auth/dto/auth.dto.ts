import { ApiProperty } from '@nestjs/swagger';
import { UserType, userTypeArray } from '../../common/types';

export class IUser {
  @ApiProperty({
    name: 'id',
    description: 'Идентификатор пользователя в системе ЭИОС КемГУ',
    type: Number,
    example: 12345,
    required: true,
  })
  id?: number | null;

  @ApiProperty({
    name: 'login',
    description: 'Логин пользователя в системе ЭИОС КемГУ',
    type: String,
    example: 'stud12345',
    required: true,
  })
  login?: string | null;

  @ApiProperty({
    name: 'firstName',
    description: 'Имя пользователя в системе ЭИОС КемГУ',
    type: String,
    example: 'Иван',
    required: false,
  })
  firstName?: string | null;

  @ApiProperty({
    name: 'lastName',
    description: 'Фамилия пользователя в системе ЭИОС КемГУ',
    type: String,
    example: 12345,
    required: false,
  })
  lastName?: string | null;

  @ApiProperty({
    name: 'middleName',
    description: 'Отчество пользователя в системе ЭИОС КемГУ',
    type: Number,
    example: 12345,
    required: false,
  })
  middleName?: string | null;

  @ApiProperty({
    name: 'email',
    description: 'Почта пользователя в системе ЭИОС КемГУ',
    type: String,
    example: 'user@example.com',
    required: false,
  })
  email?: string | null;

  @ApiProperty({
    name: 'phone',
    description: 'Номер телефона пользователя в системе ЭИОС КемГУ',
    type: String,
    example: '+79953451234',
    required: false,
  })
  phone?: string | null;

  @ApiProperty({
    name: 'blocked',
    description: 'Флаг блокировки пользователя в системе ЭИОС КемГУ',
    enum: [0, 1],
    example: 12345,
    required: false,
  })
  blocked?: 0 | 1 | null;

  @ApiProperty({
    name: 'userType',
    description: 'Тип пользователя в системе ЭИОС КемГУ',
    enum: userTypeArray,
    example: 12345,
    required: true,
  })
  userType?: UserType | null;
}

export class UserAuthDto {
  @ApiProperty({
    name: 'login',
    type: String,
    description: 'Логин пользователя в eios',
    required: true,
    example: 'stud12345',
  })
  login: string;

  @ApiProperty({
    name: 'password',
    type: String,
    description: 'Пароль пользователя в eios',
    required: true,
    example: '1234567890',
  })
  password: string;
}

export class UpdateTokenDto {
  @ApiProperty({
    name: 'accessToken',
    description: 'Старый токен для работы с API',
    type: String,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYWNjZXNzIiwiaXAiOiIyLjYyLjIwOS4xNTIiLCJ1c2VySWQiOjIyNDUwLCJpYXQiOjE2ODE2NjI1ODUsImV4cCI6MTY4MTc0ODk4NX0.ZREAgXbIGofNWYjtgdhJz3JcnRR48Ia1Pb0AkUeSiXk',
    required: false,
  })
  accessToken: string;
}

export class UpdateTokenResponse {
  @ApiProperty({
    name: 'success',
    type: Boolean,
    description: 'Флаг статуса запроса аутентификации',
    required: false,
    example: true,
  })
  success: boolean;

  @ApiProperty({
    name: 'accessToken',
    description: 'Новый токен для работы с API',
    type: String,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYWNjZXNzIiwiaXAiOiIyLjYyLjIwOS4xNTIiLCJ1c2VySWQiOjIyNDUwLCJpYXQiOjE2ODE2NjI1ODUsImV4cCI6MTY4MTc0ODk4NX0.ZREAgXbIGofNWYjtgdhJz3JcnRR48Ia1Pb0AkUeSiXk',
    required: false,
  })
  accessToken: string;

  @ApiProperty({
    name: 'accessToken',
    description: 'Старый токен для работы с API',
    type: String,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYWNjZXNzIiwiaXAiOiIyLjYyLjIwOS4xNTIiLCJ1c2VySWQiOjIyNDUwLCJpYXQiOjE2ODE2NjI1ODUsImV4cCI6MTY4MTc0ODk4NX0.ZREAgXbIGofNWYjtgdhJz3JcnRR48Ia1Pb0AkUeSiXk',
    required: false,
  })
  prevAccessToken: string;
}

export class AuthResponse {
  @ApiProperty({
    name: 'success',
    type: Boolean,
    description: 'Флаг статуса запроса аутентификации',
    required: false,
    example: true,
  })
  success?: boolean;

  @ApiProperty({
    name: 'userInfo',
    type: IUser,
    required: false,
    description:
      'Данные пользователя из системы ЭИОС КемГУ. При успешной аутентификации в нашей системе данные синхронизируются',
  })
  userInfo?: IUser;

  @ApiProperty({
    name: 'accessToken',
    type: String,
    required: false,
    description: 'Токен пользователя при успешной аутентификации',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYWNjZXNzIiwiaXAiOiIyLjYyLjIwOS4xNTIiLCJ1c2VySWQiOjIyNDUwLCJpYXQiOjE2ODE2NjA0NTAsImV4cCI6MTY4MTc0Njg1MH0.zRh3LUJ4iMfqxyrKjs4F0yqgbU74OZpjYx7MsaHiRic',
  })
  accessToken?: string;

  @ApiProperty({
    name: 'message',
    required: false,
    description:
      'Свойство ошибки аутентификации. Может появиться только в случае success: false или статус-кода, отличного от 2xx',
    example: 'Некорректный логин/пароль пользователя!',
  })
  message?: string;
}

export class GetUserByAccessToken {
  token: string;
}
