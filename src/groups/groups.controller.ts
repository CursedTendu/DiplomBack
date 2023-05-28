import { Controller, Get, Inject, Req } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Request } from 'express';
import { Roles } from '../auth/roles.decorator';
import { UserRolesEnum } from '../common/types';

@Controller('groups')
export class GroupsController {
  constructor(
    private readonly groupsService: GroupsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get('teacher')
  @Roles(UserRolesEnum.Employer)
  async getTeacherGroups(@Req() request: Request) {
    const teacherContext = await this.cacheManager.get<string>(
      request.headers.authorization.split(' ')[1],
    );

    return this.groupsService.getTeacherGroups(+teacherContext.split('_')[1]);
  }
}
