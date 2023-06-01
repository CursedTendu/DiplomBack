import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { AttestationService } from './attestation.service';
import {
  AttestationCreatePayload,
  AttestationUpdatePayload,
  CalculateAttestationDto,
} from './dto';
import { Roles } from '../auth/roles.decorator';
import { UserRolesEnum } from '../common/types';
import { Request } from 'express';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Controller('attestation')
export class AttestationController {
  constructor(
    private readonly attestationService: AttestationService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Roles(UserRolesEnum.Employer)
  @Get()
  async getTeacherAttestation(
    @Query('subjectId') subjectId: string,
    @Query('groupId') groupId: string,
    @Req() request: Request,
  ) {
    const teacherContext = await this.cacheManager.get<string>(
      request.headers.authorization.split(' ')[1],
    );

    return this.attestationService.getTeacherAttestation(
      teacherContext.split('_')[1],
      subjectId,
      groupId,
    );
  }

  @Roles(UserRolesEnum.Employer)
  @Post()
  @HttpCode(HttpStatus.OK)
  async createAttestation(
    @Body() payload: AttestationCreatePayload,
    @Req() request: Request,
  ) {
    const teacherContext = await this.cacheManager.get<string>(
      request.headers.authorization.split(' ')[1],
    );

    return this.attestationService.createAttestation({
      teacherId: teacherContext.split('_')[1],
      payload,
    });
  }

  @Roles(UserRolesEnum.Student)
  @Get('user')
  async getUserAttestation(@Param('id') id: string, @Req() request: Request) {
    const userContext = await this.cacheManager.get<string>(
      request.headers.authorization.split(' ')[1],
    );

    return this.attestationService.getUserAttestation(
      +userContext.split('_')[1],
    );
  }

  @Post('calculate')
  @Roles(UserRolesEnum.Employer)
  async calculateAttestation(
    @Body() payload: CalculateAttestationDto,
    @Req() request: Request,
  ) {
    const userContext = await this.cacheManager.get<string>(
      request.headers.authorization.split(' ')[1],
    );

    return this.attestationService.calculateAttestation(
      payload,
      +userContext.split('_')[1],
    );
  }

  @Put(':id')
  @Roles(UserRolesEnum.Employer)
  async updateUserAttestation(
    @Param('id') id: string,
    @Body() payload: AttestationUpdatePayload,
    @Req() request: Request,
  ) {
    const teacherContext = await this.cacheManager.get<string>(
      request.headers.authorization.split(' ')[1],
    );

    return this.attestationService.updateUserAttestation({
      id,
      payload,
      teacherId: +teacherContext.split('_')[1],
    });
  }

  @Get(':id')
  async getAttestation(@Param('id') id: string) {
    return id;
  }
}
