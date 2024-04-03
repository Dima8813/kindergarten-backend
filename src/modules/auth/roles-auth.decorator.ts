import { SetMetadata } from '@nestjs/common';

export const ROlES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROlES_KEY, roles);
