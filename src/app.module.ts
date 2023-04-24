import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link, Subject, SubjectsUser, User, VisitMark } from './entities';
import { VisitsModule } from './visits/visits.module';
import { SubjectsModule } from './subjects/subjects.module';
import { AuthGuard } from './auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';

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
      entities: [User, Link, VisitMark, Subject, SubjectsUser],
      synchronize: true,
    }),
    VisitsModule,
    SubjectsModule,
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
