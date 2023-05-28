import {
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { Roles } from '../auth/roles.decorator';
import { UserRolesEnum } from '../common/types';
import { Request } from 'express';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Controller('subjects')
export class SubjectsController {
  constructor(
    private readonly subjectsService: SubjectsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Post()
  @Roles(UserRolesEnum.Employer)
  addNewSubject() {
    return 'addNewSubject';
  }

  @Get('teacher')
  @Roles(UserRolesEnum.Employer)
  async getTeacherSubjects(@Req() request: Request) {
    const teacherContext = await this.cacheManager.get<string>(
      request.headers.authorization.split(' ')[1],
    );

    return this.subjectsService.getTeacherSubjects(
      +teacherContext.split('_')[1],
    );
  }

  @Get('student')
  @Roles(UserRolesEnum.Employer)
  async getStudentSubjects(@Req() request: Request) {
    const teacherContext = await this.cacheManager.get<string>(
      request.headers.authorization.split(' ')[1],
    );

    return this.subjectsService.getTeacherSubjects(
      +teacherContext.split('_')[1],
    );
  }

  @Get('students/:id')
  @Roles(UserRolesEnum.Employer)
  async getStudents(@Param('id') id: string, @Req() request: Request) {
    const teacherContext = await this.cacheManager.get<string>(
      request.headers.authorization.split(' ')[1],
    );

    return this.subjectsService.getStudents(+id, +teacherContext.split('_')[1]);
  }

  @Get(':id')
  getSubjectById() {
    return 'getSubjectById';
  }

  @Delete()
  @Roles(UserRolesEnum.Employer)
  deleteSubject() {
    return 'deleteSubject';
  }
}
