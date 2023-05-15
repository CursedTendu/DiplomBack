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

  async getTeacherSubjects(id: number) {
    return this.subjectRepository.find({
      where: {
        teacher: { userId: id },
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
