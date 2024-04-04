import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './models/user.model';
import { Role } from '../role/models/role.model';
import { UserRoles } from '../role/models/user-roles.model';
import { RoleModule } from '../role/role.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Role, UserRoles]),
    RoleModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
