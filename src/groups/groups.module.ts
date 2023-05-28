import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group, GroupUsers } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([GroupUsers, Group])],
  controllers: [GroupsController],
  providers: [GroupsService],
})
export class GroupsModule {}
