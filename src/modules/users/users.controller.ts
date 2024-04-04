import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Roles } from '../auth/roles-auth.decorator';
import { UsersService } from './users.service';
import { User } from './models/user.model';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { RoleEnum } from '@core/enums';
import { AddRoleDto } from './dto/add-role.dto';
import { RolesGuard } from '../../common/guards';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiTags('Users')
  @ApiResponse({ status: 200, type: [User] })
  @Roles(RoleEnum.ADMIN, RoleEnum.TEACHER)
  @UseGuards(RolesGuard)
  @Get()
  getAll(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @ApiTags('Users')
  @ApiOperation({ summary: 'Get user by email' })
  @ApiResponse({ status: 200, type: User })
  @Get('/getUserByEmail')
  getUserByEmail(@Body() dto: { email: string }): Promise<User> {
    return this.userService.findUserByEmail(dto.email);
  }

  @ApiTags('Users')
  @ApiResponse({ status: 201, type: User })
  @Post()
  create(@Body() dto: CreateUserDto): Promise<User> {
    return this.userService.createUser(dto);
  }

  @ApiTags('Users')
  @ApiOperation({ summary: 'Add role' })
  @ApiResponse({ status: 200 })
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @Post('/role')
  addRole(@Body() dto: AddRoleDto): Promise<User> {
    return this.userService.addRole(dto);
  }

  @ApiTags('Users')
  @ApiOperation({ summary: 'Ban a user' })
  @ApiResponse({ status: 200 })
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @Post('/ban')
  ban(@Body() banUserDto: BanUserDto): Promise<User> {
    return this.userService.ban(banUserDto);
  }

  @ApiTags('Users')
  @ApiResponse({
    status: 200,
    description: 'The user has been deleted.',
  })
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @Delete('/:id')
  delete(@Param('id') id: string): Promise<boolean> {
    return this.userService.deleteUser(+id);
  }
}
