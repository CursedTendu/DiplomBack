import { Module } from '@nestjs/common';
import { VisitsService } from './visits.service';
import { VisitsController } from './visits.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link, Subject, SubjectsUser, User, VisitMark } from '../entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Link, VisitMark, Subject, SubjectsUser]),
  ],
  controllers: [VisitsController],
  providers: [VisitsService],
})
export class VisitsModule {}
