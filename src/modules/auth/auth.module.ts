import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { TokenModule } from '../token/token.module';

import { JwtStrategy } from '../../strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [forwardRef(() => UsersModule), TokenModule, JwtModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtModule],
})
export class AuthModule {}
