import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from '../token/token.service';

@Module({
  imports: [forwardRef(() => UsersModule), JwtModule],
  providers: [AuthService, TokenService],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
