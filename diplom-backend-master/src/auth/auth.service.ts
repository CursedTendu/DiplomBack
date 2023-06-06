import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager/dist/cache.constants';
import axios, { AxiosInstance } from 'axios';
import {
  AuthResponse,
  GetUserByAccessToken,
  IUser,
  UpdateTokenDto,
  UserAuthDto,
} from './dto';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities';
import { TOKEN_CACHE_TTL } from '../common/constants';

@Injectable()
export class AuthService {
  private kemsuApi: AxiosInstance;
  private authServiceLog = new Logger('AuthService');

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    this.kemsuApi = axios.create({
      baseURL: process.env.KEMSU_API_URL,
    });
  }

  async getUserByAccessToken(payload: GetUserByAccessToken) {
    const userContext = await this.cacheManager.get<string>(payload.token);

    if (!userContext) {
      throw new ForbiddenException();
    }

    const user = await this.userRepository.findOne({
      where: { userId: +userContext.split('_')[1] },
    });

    console.log(user);

    if (!user) {
      throw new NotFoundException();
    }

    return {
      ...user,
      accessToken: payload.token,
    };
  }

  async sign(payload: UserAuthDto): Promise<AuthResponse> {
    try {
      const { data } = await this.kemsuApi.post<AuthResponse>('api/auth', {
        login: payload.login,
        password: payload.password,
      });

      await Promise.allSettled([
        this.cacheManager.set(
          data.accessToken,
          `${data.userInfo.userType}_${data.userInfo.id}`,
          TOKEN_CACHE_TTL,
        ),
        this.saveOrUpdateUser(data.userInfo),
      ]);

      if (data?.userInfo?.blocked === 1) {
        throw { response: { data: 'Вы были заблокированы в системе kemsu' } };
      }

      return data;
    } catch (error) {
      this.authServiceLog.log(error?.response?.data);

      throw new UnauthorizedException(error?.response?.data);
    }
  }

  async updateToken(payload: UpdateTokenDto) {
    try {
      const { data } = await this.kemsuApi.post('api/security/auth/prolong', {
        accessToken: payload.accessToken,
      });

      return data;
    } catch (error) {
      console.log(error?.response?.data);

      throw new UnauthorizedException(error?.response?.data);
    }
  }

  private async saveOrUpdateUser(user: IUser) {
    const clearUser = {
      userId: user.id,
      login: user.login,
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName,
      email: user.email,
      phone: user.phone,
      blocked: user.blocked,
      userType: user.userType,
    };

    const dbUser = await this.userRepository.findOne({
      where: { userId: user.id },
    });

    if (!dbUser) {
      return await this.userRepository.save(clearUser);
    }

    return await this.userRepository.save({
      ...dbUser,
      ...clearUser,
    });
  }
}
