import { Module } from '@nestjs/common';
import { AttestationService } from './attestation.service';
import { AttestationController } from './attestation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttestationScore, SubjectsUser, User, VisitMark } from '../entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([AttestationScore, User, SubjectsUser, VisitMark]),
  ],
  controllers: [AttestationController],
  providers: [AttestationService],
})
export class AttestationModule {}
