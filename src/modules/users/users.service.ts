import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';

import { User } from './models/user.model';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { RoleService } from '../role/role.service';
import { Role } from '../role/models/role.model';
import { BanUserDto } from './dto/ban-user.dto';
import { AppErrors } from '@core/consts';
import { AddRoleDto } from './dto/add-role.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
    private readonly roleService: RoleService,
  ) {}

  async createUser(userDto: CreateUserDto): Promise<User> {
    const hashPassword: string = await this.hashPassword(userDto.password);
    const user: User = await this.userRepository.create({
      ...userDto,
      password: hashPassword,
    });

    const role: Role = userDto.role
      ? await this.roleService.getRoleByValue(userDto.role)
      : await this.roleService.getRoleByValue('USER');

    await user.$set('roles', [role.id]);
    user.roles = [role];

    return user;
  }

  async getAllUsers(): Promise<User[]> {
    const users: User[] = await this.userRepository.findAll({
      include: { all: true },
    });

    return users;
  }

  async findUserByEmail(email: string): Promise<User> {
    const user: User = await this.userRepository.findOne({
      where: { email: email },
      include: { all: true },
    });

    return user;
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      await this.userRepository.destroy({ where: { id } });
      return true;
    } catch (e) {
      throw new Error(e);
    }
  }

  async publicUser(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { email },
      attributes: { exclude: ['password'] },
      include: {
        all: true,
      },
    });
  }

  async addRole(dto: AddRoleDto): Promise<User> {
    const user: User = await this.userRepository.findByPk(dto.userId);
    const role: Role = await this.roleService.getRoleByValue(dto.value);

    if (user && role) {
      await user.$add('role', role.id);
      return user;
    }

    throw new HttpException(
      AppErrors.USER_OR_ROLE_NOT_FOUND,
      HttpStatus.NOT_FOUND,
    );
  }

  async ban(dto: BanUserDto): Promise<User> {
    const user: User = await this.userRepository.findByPk(dto.userId);

    if (!user) {
      throw new HttpException(AppErrors.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    user.banned = true;
    user.bannedReason = dto.banReason;

    await user.save();
    return user;
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
