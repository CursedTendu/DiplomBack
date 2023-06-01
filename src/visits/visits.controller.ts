import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  Put,
  Req,
  Inject,
  HttpStatus,
} from '@nestjs/common';
import { VisitsService } from './visits.service';
import { CreateMarkSession, GetVisitsDto, SetMarkStateDto } from './dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { VisitMark } from '../entities';
import { HttpStatusCode } from 'axios';
import { Roles } from '../auth/roles.decorator';
import { UserRolesEnum } from '../common/types';
import { Public } from '../auth/public.decorator';
import { Request } from 'express';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Controller('visits')
@ApiTags('Посещения')
export class VisitsController {
  constructor(
    private readonly visitsService: VisitsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Метод для получения данных об успеваемости студентов',
  })
  async getVisits(@Body() payload: GetVisitsDto, @Req() request: Request) {
    const userContext = await this.cacheManager.get<string>(
      request.headers.authorization.split(' ')[1],
    );

    return this.visitsService.getVisits(payload, userContext);
  }

  @Post('more')
  @HttpCode(HttpStatus.OK)
  async getMoreVisits(@Body() payload: GetVisitsDto, @Req() request: Request) {
    const userContext = await this.cacheManager.get<string>(
      request.headers.authorization.split(' ')[1],
    );

    return this.visitsService.getMoreVisits(payload, userContext);
  }

  @Post('create-mark-session')
  @Roles(UserRolesEnum.Employer)
  @ApiOperation({ summary: 'Метод для создания сессии отметки' })
  @ApiBody({
    description:
      'Тело запроса для создания сессии отметки. Имеются как обязательные параметры, так и необязательные: смотреть схему ниже. При создании ссылки, в БД сохраняются все отметки пользователей, закрепленных за предметом. Значение отметки равно нулю',
    type: CreateMarkSession,
  })
  @ApiBearerAuth()
  async createMarkSession(@Body() payload: CreateMarkSession) {
    return this.visitsService.createMarkSession(payload);
  }

  @Put('set-mark-state')
  @Roles(UserRolesEnum.Student)
  @HttpCode(HttpStatusCode.Ok)
  @ApiOperation({ summary: 'Метод для отметки пользователя' })
  @ApiBody({
    description: 'Тело для отметки пользователя',
    type: SetMarkStateDto,
  })
  @ApiBearerAuth()
  async setMarkState(@Body() payload: SetMarkStateDto): Promise<VisitMark> {
    return this.visitsService.setMarkState(payload);
  }

  @Get(':linkId')
  @Public()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Метод для получения данных о ссылке' })
  async getLink(@Param('linkId') linkId: string) {
    return this.visitsService.getLink(linkId);
  }
}
