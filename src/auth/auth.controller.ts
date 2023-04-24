import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthResponse,
  GetUserByAccessToken,
  UpdateTokenDto,
  UserAuthDto,
} from './dto';
import { Public } from './public.decorator';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpStatusCode } from 'axios';

@Controller('auth')
@ApiTags('Аутентификация')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign')
  @HttpCode(HttpStatusCode.Ok)
  @Public()
  @ApiOperation({ summary: 'Метод для аутентификации пользователя' })
  @ApiBody({
    description: 'Тело запроса для аутентификации пользователя',
    type: UserAuthDto,
  })
  @ApiResponse({
    status: HttpStatusCode.Ok,
    type: AuthResponse,
    description:
      'В данной схеме описаны все свойства, которые можно получить при запросе на аутентификацию',
  })
  async sign(@Body() payload: UserAuthDto): Promise<AuthResponse> {
    return this.authService.sign(payload);
  }

  @Post('update')
  @HttpCode(HttpStatusCode.Ok)
  @Public()
  @ApiOperation({ summary: 'Метод для получения нового токена доступа к API' })
  @ApiBody({
    description: 'Тело запроса для получения нового токена доступа к API',
    type: UserAuthDto,
  })
  @ApiResponse({
    status: HttpStatusCode.Ok,
    type: AuthResponse,
    description:
      'В данной схеме описаны все свойства, которые можно получить при запросе на получение нового токена доступа к API',
  })
  async updateToken(@Body() payload: UpdateTokenDto) {
    return this.authService.updateToken(payload);
  }

  @Post('user')
  @Public()
  @HttpCode(HttpStatusCode.Ok)
  async getUserByAccessToken(@Body() payload: GetUserByAccessToken) {
    return this.authService.getUserByAccessToken(payload);
  }
}
