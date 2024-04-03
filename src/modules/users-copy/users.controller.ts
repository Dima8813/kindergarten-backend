import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { UpdateUserDTO } from './dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guards/jwt-guard';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  // @ApiTags('Users')
  // @ApiResponse({ status: 201, type: CreateUserDTO })
  // @Post('create-user')
  // createUsers(@Body() dto: CreateUserDTO): Promise<CreateUserDTO> {
  //   return this.userService.createUser(dto);
  // }

  @ApiTags('Users')
  @ApiResponse({ status: 200, type: UpdateUserDTO })
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<UpdateUserDTO[]> {
    return this.userService.allUsers();
  }

  @ApiTags('Users')
  @ApiResponse({ status: 200, type: UpdateUserDTO })
  @UseGuards(JwtAuthGuard)
  @Patch('update-user')
  updateUsers(
    @Body() updateDto: UpdateUserDTO,
    @Req() request,
  ): Promise<UpdateUserDTO> {
    const user = request.user;
    return this.userService.updateUser(user.email, updateDto);
  }

  @ApiTags('Users')
  @ApiResponse({
    status: 200,
    description: 'The user has been deleted.',
  })
  @UseGuards(JwtAuthGuard)
  @Delete('delete-user')
  deleteUsers(@Req() request): Promise<boolean> {
    const user = request.user;
    return this.userService.deleteUser(user.email);
  }
}
