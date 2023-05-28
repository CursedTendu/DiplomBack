import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AttestationScore, SubjectsUser, User, VisitMark } from '../entities';
import { FindOptionsWhere, Repository } from 'typeorm';
import { AttestationCreatePayload, AttestationUpdatePayload } from './dto';

@Injectable()
export class AttestationService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(AttestationScore)
    private attestationScoreRepository: Repository<AttestationScore>,
    @InjectRepository(SubjectsUser)
    private subjectsUserRepository: Repository<SubjectsUser>,
    @InjectRepository(VisitMark)
    private visitMarkRepository: Repository<VisitMark>,
  ) {}

  async createAttestation({
    teacherId,
    payload,
  }: {
    teacherId: string;
    payload: AttestationCreatePayload;
  }) {
    const subjectStudent = await this.subjectsUserRepository.findOne({
      where: {
        subject: { teacher: { userId: +teacherId }, id: payload.subject },
        student: { id: payload.student },
      },
      relations: ['subject', 'subject.teacher', 'student'],
    });

    if (!subjectStudent) {
      throw new NotFoundException('this student or subject does not exist');
    }

    await this.attestationScoreRepository.insert({
      score: payload.score,
      student: subjectStudent.student,
      teacher: subjectStudent.subject.teacher,
      subject: subjectStudent.subject,
    });

    return {
      success: true,
    };
  }

  async getUserAttestation(id: number) {
    const attestations = await this.attestationScoreRepository.find({
      where: {
        student: { userId: id },
      },
      relations: ['subject', 'teacher'],
    });

    return attestations;
  }

  async getTeacherAttestation(id: string, subjectId: string) {
    const where: FindOptionsWhere<AttestationScore> = {
      teacher: { userId: +id },
    };

    if (subjectId) {
      where.subject = { id: +subjectId };
    }

    const attestations = await this.attestationScoreRepository.find({
      where,
      relations: ['subject', 'student'],
    });

    const result = [];

    for (const attestation of attestations) {
      const skipCount = await this.visitMarkRepository.count({
        where: {
          student: {
            id: attestation.student.id,
          },
          subject: {
            id: attestation.subject.id,
          },
          state: 0,
        },
      });

      result.push({
        ...attestation,
        skipCount,
      });
    }

    return result;
  }

  async updateUserAttestation({
    id,
    payload,
    teacherId,
  }: {
    id: string;
    payload: AttestationUpdatePayload;
    teacherId: number;
  }) {
    const attestation = await this.attestationScoreRepository.findOne({
      where: {
        id,
        teacher: { userId: teacherId },
      },
    });

    if (!attestation) {
      throw new NotFoundException();
    }

    return await this.attestationScoreRepository.save({
      ...attestation,
      score: payload.score,
    });
  }
}
