import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Link, Subject, SubjectsUser, User, VisitMark } from '../entities';
import { Repository } from 'typeorm';
import { CreateMarkSession, SetMarkStateDto } from './dto';
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
