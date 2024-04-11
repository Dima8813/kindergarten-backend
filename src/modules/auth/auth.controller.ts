import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../users/models/user.model';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from '@core/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiTags('AUTH')
  @ApiResponse({ status: 201, type: User })
  @Post('/registration')
  registration(@Body() userDto: CreateUserDto): Promise<User> {
    return this.authService.registration(userDto);
  }

  @ApiTags('AUTH')
  @ApiResponse({ status: 200 })
  @Post('login')
  login(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<{ user: User; token: string }> {
    return this.authService.login(loginUserDto);
  }
}
