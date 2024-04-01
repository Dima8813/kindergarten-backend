import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';

import { User } from './models/user.model';
import { CreateUserDTO, UpdateUserDTO } from './dto';
import { AppErrors } from '../../common/consts/errors';
import { AuthUserResponse } from '../auth/response';
import { WatchList } from '../watch-list/models/watch-list.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email: email } });
  }

  async createUser(dto: CreateUserDTO): Promise<CreateUserDTO> {
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
  }

  async publicUser(email: string): Promise<any> {
    return await this.userRepository.findOne({
      where: { email },
      attributes: { exclude: ['password'] },
      include: {
        model: WatchList,
        required: false,
      },
    });
  }

  async allUsers(): Promise<UpdateUserDTO[]> {
    return await this.userRepository.findAll({
      attributes: { exclude: ['password'] },
    });
  }

  async updateUser(email: string, dto: UpdateUserDTO): Promise<UpdateUserDTO> {
    await this.userRepository.update(dto, { where: { email } });
    return dto;
  }

  async deleteUser(email: string): Promise<boolean> {
    await this.userRepository.destroy({ where: { email } });
    return true;
  }
}
