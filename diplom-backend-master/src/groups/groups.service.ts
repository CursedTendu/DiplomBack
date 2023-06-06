import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group, GroupUsers } from '../entities';
import { Repository } from 'typeorm';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(GroupUsers)
    private groupUsersRepository: Repository<GroupUsers>,
    @InjectRepository(Group) private groupRepository: Repository<Group>,
  ) {}

  async getTeacherGroups(userId: number) {
    return this.groupRepository.find({
      where: {
        teacher: { userId },
      },
    });
  }
}
