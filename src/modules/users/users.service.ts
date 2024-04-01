import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';

import { User } from './models/user.model';
import { CreateUserDTO, UpdateUserDTO } from './dto';
import { AppErrors } from '../../common/consts/errors';
import { WatchList } from '../watch-list/models/watch-list.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
  ) {}

  async hashPassword(password: string): Promise<string> {
    try {
      return bcrypt.hash(password, 10);
    } catch (e) {
      throw new Error(e);
    }
  }

  async findUserByEmail(email: string): Promise<User> {
    try {
      return this.userRepository.findOne({ where: { email: email } });
    } catch (e) {
      throw new Error(e);
    }
  }

  async createUser(dto: CreateUserDTO): Promise<CreateUserDTO> {
    try {
      const existUser: User = await this.findUserByEmail(dto.email);

      if (existUser) throw new BadRequestException(AppErrors.USER_EXIST);

      dto.password = await this.hashPassword(dto.password);
      await this.userRepository.create({
        firstName: dto.firstName,
        surname: dto.surname,
        email: dto.email,
        password: dto.password,
      });

      return dto;
    } catch (e) {
      throw new Error(e);
    }
  }

  async publicUser(email: string): Promise<User> {
    try {
      return await this.userRepository.findOne({
        where: { email },
        attributes: { exclude: ['password'] },
        include: {
          model: WatchList,
          required: false,
        },
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  async allUsers(): Promise<UpdateUserDTO[]> {
    try {
      return await this.userRepository.findAll({
        attributes: { exclude: ['password'] },
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  async updateUser(email: string, dto: UpdateUserDTO): Promise<UpdateUserDTO> {
    try {
      await this.userRepository.update(dto, { where: { email } });
      return dto;
    } catch (e) {
      throw new Error(e);
    }
  }

  async deleteUser(email: string): Promise<boolean> {
    try {
      await this.userRepository.destroy({ where: { email } });
      return true;
    } catch (e) {
      throw new Error(e);
    }
  }
}
