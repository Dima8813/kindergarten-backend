import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { Role } from './models/role.model';
import { User } from '../users/models/user.model';
import { UserRoles } from './models/user-roles.model';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [SequelizeModule.forFeature([Role, User, UserRoles]), JwtModule],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
