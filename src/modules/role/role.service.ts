import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Role } from './models/role.model';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role) private readonly roleRepository: typeof Role,
  ) {}

  async createRole(dto: CreateRoleDto): Promise<Role> {
    const role: Role = await this.roleRepository.create(dto);
    return role;
  }

  async getAll(): Promise<Role[]> {
    const roles: Role[] = await this.roleRepository.findAll();
    return roles;
  }

  async getRoleByValue(value: string): Promise<Role> {
    const role: Role = await this.roleRepository.findOne({
      where: { value },
    });
    return role;
  }
}
