import { SetMetadata } from '@nestjs/common';
import { UserRolesEnum } from '../common/types';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRolesEnum[]) =>
  SetMetadata(ROLES_KEY, roles);
