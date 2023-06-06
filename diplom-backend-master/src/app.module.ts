import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AttestationScore,
  GroupUsers,
  Link,
  Subject,
  SubjectsUser,
  Task,
  TaskResults,
  User,
  VisitMark,
} from './entities';
import { VisitsModule } from './visits/visits.module';
import { SubjectsModule } from './subjects/subjects.module';
import { AuthGuard } from './auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { AttestationModule } from './attestation/attestation.module';
import { Group } from './entities/groups.entity';
import { GroupsModule } from './groups/groups.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    TypeOrmModule.forRoot({
      username: process.env.DB_USERNAME,
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      password: process.env.DB_PASSWORD,
      type: 'mysql',
      entities: [
        User,
        Link,
        VisitMark,
        Subject,
        SubjectsUser,
        AttestationScore,
        Group,
        GroupUsers,
        Task,
        TaskResults,
      ],
      synchronize: true,
    }),
    VisitsModule,
    SubjectsModule,
    AttestationModule,
    GroupsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
