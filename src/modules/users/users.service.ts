import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './models/user.model';
import { RoleService } from '../role/role.service';
import { Role } from '../role/models/role.model';
import * as bcrypt from 'bcrypt';
import { AddRoleDto } from './dto/add-role.dto';
import { BanUserDto } from './dto/ban-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
    private readonly roleService: RoleService,
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const user: User = await this.userRepository.create(dto);
    const role: Role = dto.role
      ? await this.roleService.getRoleByValue(dto.role)
      : await this.roleService.getRoleByValue('User');

    await user.$set('roles', [role.id]);
    user.roles = [role];

    return user;
  }

  async getAllUsers(): Promise<any> {
    const users: User[] = await this.userRepository.findAll({
      include: { all: true },
    });
    return users;
  }

  async addRole(dto: AddRoleDto): Promise<User> {
    const user: User = await this.userRepository.findByPk(dto.userId);
    const role: Role = await this.roleService.getRoleByValue(dto.value);

    if (user && role) {
      await user.$add('role', role.id);
      return user;
    }

    throw new HttpException(
      'Пользователь или роль не найдены',
      HttpStatus.NOT_FOUND,
    );
  }

  async ban(dto: BanUserDto): Promise<User> {
    const user: User = await this.userRepository.findByPk(dto.userId);
    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }

    user.banned = true;
    user.bannedReason = dto.banReason;

    await user.save();
    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user: User = await this.userRepository.findOne({
      where: { email },
      include: { all: true },
    });

    return user;
  }

  async hashPassword(password: string): Promise<string> {
    try {
      return bcrypt.hash(password, 10);
    } catch (e) {
      throw new Error(e);
    }
  }

  async comparePass(pass: string, passOld: string) {
    return bcrypt.compare(passOld, pass);
  }
}
