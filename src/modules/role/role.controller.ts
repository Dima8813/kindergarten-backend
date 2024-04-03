import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from './models/role.model';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiTags('Roles')
  @Post()
  @ApiResponse({ status: 200, type: Role })
  create(@Body() roleDto: CreateRoleDto): Promise<Role> {
    return this.roleService.createRole(roleDto);
  }

  @ApiTags('Roles')
  @Get()
  @ApiResponse({ status: 200, type: [Role] })
  getAll(): Promise<Role[]> {
    return this.roleService.getAll();
  }

  @ApiTags('Roles')
  @Get('/:value')
  @ApiResponse({ status: 200, type: Role })
  getByValue(@Param('value') value: string): Promise<Role> {
    return this.roleService.getRoleByValue(value);
  }
}
