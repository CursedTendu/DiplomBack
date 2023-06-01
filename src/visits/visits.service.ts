import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Link, Subject, SubjectsUser, User, VisitMark } from '../entities';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateMarkSession, GetVisitsDto, SetMarkStateDto } from './dto';
import { generateToken } from '../utils';

@Injectable()
export class VisitsService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(VisitMark)
    private visitMarkRepository: Repository<VisitMark>,
    @InjectRepository(Link) private linkRepository: Repository<Link>,
    @InjectRepository(Subject) private subjectRepository: Repository<Subject>,
    @InjectRepository(SubjectsUser)
    private subjectsUserRepository: Repository<SubjectsUser>,
  ) {}

  async getVisits(payload: GetVisitsDto, user: string) {
    const where: FindOptionsWhere<SubjectsUser> = {};
    const visitWhere: FindOptionsWhere<VisitMark> = {};

    const [role, userId] = user.split('_');

    if (role === 'сотрудник') {
      where.subject = { teacher: { userId: +userId } };
      visitWhere.subject = { teacher: { userId: +userId } };
    }

    if (role === 'обучающийся') {
      where.student = { userId: +userId };
      visitWhere.student = { userId: +userId };
    }

    if (payload?.subject) {
      where.subject = { id: payload.subject };
    }

    const subjects = await this.subjectsUserRepository.find({
      where,
      relations: ['subject', 'subject.teacher', 'student'],
    });

    const result = [];

    for (const subjectContext of subjects) {
      const [skipCount, totalCount] = await Promise.all([
        this.visitMarkRepository.count({
          where: {
            state: 0,
            subject: {
              id: payload.subject,
            },
            student: {
              id: subjectContext.student.id,
            },
          },
        }),
        this.visitMarkRepository.count({
          where: {
            state: 1,
            subject: {
              id: payload.subject,
            },
            student: {
              id: subjectContext.student.id,
            },
          },
        }),
      ]);

      result.push({
        ...subjectContext,
        skipCount,
        totalCount,
      });
    }

    return result;
  }

  async getMoreVisits(payload: GetVisitsDto, user: string) {
    console.log(user);

    const [role, userId] = user.split('_');

    if (role === 'сотрудник') {
      // сотрудник
    }

    if (role === 'обучающийся') {
      return await this.visitMarkRepository.find({
        where: {
          student: {
            userId: +userId,
          },
          subject: {
            id: payload.subject,
          },
        },
        relations: ['subject', 'link'],
      });
    }
  }

  async getStudentsBySubjectId(subjectId: number) {
    return this.subjectsUserRepository.find({
      where: { subject: { id: subjectId } },
      relations: { student: true, subject: true },
    });
  }

  async setMarkState(payload: SetMarkStateDto): Promise<VisitMark> {
    const visit = await this.visitMarkRepository.findOne({
      where: {
        link: { linkId: payload.linkId },
        student: { id: payload.userId },
      },
    });

    if (!visit) {
      throw new NotFoundException('this visit does not exist');
    }

    return this.visitMarkRepository.save({
      ...visit,
      state: payload.state ? 1 : 0,
    });
  }

  async getLink(linkId: string) {
    return this.linkRepository.findOne({
      where: {
        linkId,
      },
    });
  }

  async createMarkSession(payload: CreateMarkSession) {
    const subject = await this.subjectRepository.findOne({
      where: { id: payload.subjectId },
      relations: { teacher: true },
    });

    if (!subject) {
      throw new NotFoundException('this subject does not exist');
    }

    const students = await this.subjectsUserRepository.find({
      where: { subject: { id: subject.id } },
      relations: { student: true },
    });

    const entityContext: Link = {};

    if (payload.markedAt) {
      entityContext.markedAt = new Date(payload.markedAt);
    }

    if (payload.ttl) {
      entityContext.ttl = payload.ttl;
    }

    entityContext.linkId = generateToken(10);

    const insertLink = await this.linkRepository.save(entityContext);

    const link = await this.linkRepository.findOne({
      where: { id: insertLink.id },
    });

    const visitMarkEntities = students.map((student) => ({
      student: student.student,
      teacher: subject.teacher,
      link,
      subject,
    }));

    await this.visitMarkRepository.insert(visitMarkEntities);

    return link;
  }
}
