import { Body, Controller, Post } from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDTO } from './dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @ApiTags('Users')
  @ApiResponse({ status: 201, type: CreateUserDTO })
  @Post('create-user')
  createUsers(@Body() dto: CreateUserDTO): Promise<CreateUserDTO> {
    return this.userService.createUser(dto);
  }
}
