import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubjectsUser, Subject } from '../entities';
import { Repository } from 'typeorm';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(SubjectsUser)
    private subjectUserRepository: Repository<SubjectsUser>,
    @InjectRepository(Subject) private subjectRepository: Repository<Subject>,
  ) {}

  async getTeacherSubjects(userId: number) {
    return this.subjectRepository.find({
      where: {
        teacher: { userId },
      },
    });
  }

  async getStudentSubjects(userId: number) {
    return this.subjectUserRepository.find({
      where: {
        student: { userId },
      },
    });
  }

  async getStudents(id: number, teacherId: number) {
    return this.subjectUserRepository.find({
      where: {
        subject: {
          teacher: {
            userId: teacherId,
          },
          id,
        },
      },
      relations: ['student'],
    });
  }
}
