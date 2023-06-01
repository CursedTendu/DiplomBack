import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AttestationScore,
  GroupUsers,
  SubjectsUser,
  TaskResults,
  User,
  VisitMark,
} from '../entities';
import { FindOptionsWhere, In, Repository } from 'typeorm';
import {
  AttestationCreatePayload,
  AttestationUpdatePayload,
  CalculateAttestationDto,
} from './dto';

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
    @InjectRepository(TaskResults)
    private tasksResultRepository: Repository<TaskResults>,
    @InjectRepository(GroupUsers)
    private groupUsersRepository: Repository<GroupUsers>,
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

  async getTeacherAttestation(id: string, subjectId: string, groupId: string) {
    const where: FindOptionsWhere<AttestationScore> = {
      teacher: { userId: +id },
    };

    if (subjectId) {
      where.subject = { id: +subjectId };
    }

    if (groupId) {
      const groupUsers = await this.groupUsersRepository.find({
        where: {
          group: {
            id: +groupId,
            teacher: {
              userId: +id,
            },
          },
        },
        relations: ['student'],
      });

      console.log(groupUsers);

      where.student = { id: In(groupUsers.map((user) => user.student.id)) };
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

  async calculateAttestation(
    payload: CalculateAttestationDto,
    teacherId: number,
  ) {
    const students = await this.groupUsersRepository.find({
      where: {
        group: {
          id: payload.groupId,
          teacher: {
            userId: teacherId,
          },
        },
      },
      relations: ['group', 'group.teacher', 'student'],
    });

    const result = [];

    if (students.length > 0) {
      for (const student of students) {
        const tasks = await this.tasksResultRepository.find({
          where: {
            student: {
              id: student.student.id,
            },
            task: {
              subject: {
                id: payload.subjectId,
              },
            },
          },
        });

        const rawPoint = tasks.reduce((acc, curr) => acc + curr.score, 0);

        let attestationScore = 0;

        if (rawPoint >= payload.points.twoPoint) {
          attestationScore = 2;
        } else if (rawPoint >= payload.points.onePoint) {
          attestationScore = 1;
        }

        result.push({
          score: attestationScore,
          student: student.student.id,
          teacher: student.group.teacher.id,
          subject: { id: payload.subjectId },
        });
      }

      this.attestationScoreRepository.insert(result);
    }

    return result;
  }
}
