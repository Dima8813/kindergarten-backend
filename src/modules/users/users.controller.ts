import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from './models/user.model';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/roles-auth.decorator';
import { RoleGuards } from '../../guards/role.guards';
import { AddRoleDto } from './dto/add-role.dto';
import { BanUserDto } from './dto/ban-user.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @ApiTags('Users')
  @Post()
  @ApiResponse({ status: 200, type: User })
  create(@Body() userDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(userDto);
  }

  @ApiTags('Users')
  @ApiResponse({ status: 200, type: [User] })
  @Roles('Administrator')
  @UseGuards(RoleGuards)
  @Get()
  getAll(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @ApiTags('Users')
  @ApiOperation({ summary: 'Выдать роль' })
  @ApiResponse({ status: 200 })
  @Roles('Administrator')
  @UseGuards(RoleGuards)
  @Post('/role')
  addRole(@Body() dto: AddRoleDto): Promise<User> {
    return this.userService.addRole(dto);
  }

  @ApiTags('Users')
  @ApiOperation({ summary: 'Забанить пользователя' })
  @ApiResponse({ status: 200 })
  @Roles('Administrator')
  @UseGuards(RoleGuards)
  @Post('/ban')
  ban(@Body() dto: BanUserDto): Promise<User> {
    return this.userService.ban(dto);
  }
}
