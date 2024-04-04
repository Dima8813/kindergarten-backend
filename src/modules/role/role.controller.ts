import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from './models/role.model';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleService } from './role.service';
import { Roles } from '../auth/roles-auth.decorator';
import { RoleEnum } from '@core/enums';
import { RolesGuard } from 'src/common/guards';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiTags('Roles')
  @ApiResponse({ status: 200, type: [Role] })
  @Get()
  getAll(): Promise<Role[]> {
    return this.roleService.getAllRoles();
  }

  @ApiTags('Roles')
  @ApiResponse({ status: 200, type: Role })
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @Get('/:value')
  getRoleByValue(@Param('value') value: string): Promise<Role> {
    return this.roleService.getRoleByValue(value);
  }

  @ApiTags('Roles')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  @ApiResponse({ status: 200, type: Role })
  create(@Body() roleDto: CreateRoleDto): Promise<Role> {
    return this.roleService.createRole(roleDto);
  }
}
