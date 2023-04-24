import { Module } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { SubjectsController } from './subjects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject, SubjectsUser, User } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, Subject, SubjectsUser])],
  controllers: [SubjectsController],
  providers: [SubjectsService],
})
export class SubjectsModule {}
