import { Controller, Delete, Get, Post } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { Roles } from '../auth/roles.decorator';
import { UserRolesEnum } from '../common/types';

@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  @Roles(UserRolesEnum.Employer)
  addNewSubject() {
    return 'addNewSubject';
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
