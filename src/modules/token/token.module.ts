import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  providers: [TokenService], // Todo: JwtService remove
  exports: [TokenService],
})
export class TokenModule {}
