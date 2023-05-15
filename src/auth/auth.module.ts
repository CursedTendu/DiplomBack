import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CacheModule } from '@nestjs/cache-manager/dist';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities';

@Module({
  imports: [
    CacheModule.register({ isGlobal: true }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
