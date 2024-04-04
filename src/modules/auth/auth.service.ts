import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AppErrors } from '../../common/consts/errors';
import { User } from '../users/models/user.model';

import * as bcrypt from 'bcrypt';
import { TokenService } from '../token/token.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  async registration(userDto: CreateUserDto): Promise<User> {
    const existUser: User = await this.usersService.findUserByEmail(
      userDto.email,
    );

    if (!!existUser) {
      throw new HttpException(AppErrors.USER_EXIST, HttpStatus.BAD_REQUEST);
    }

    return this.usersService.createUser(userDto);
  }

  async login(loginUserDto: LoginUserDto): Promise<any> {
    const existUser: User = await this.usersService.findUserByEmail(
      loginUserDto.email,
    );

    if (!existUser) {
      throw new HttpException(
        AppErrors.USER_NOT_EXIST,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const validatePassword: boolean = await bcrypt.compare(
      loginUserDto.password,
      existUser.password,
    );

    if (!validatePassword) {
      throw new HttpException(AppErrors.WRONG_DATA, HttpStatus.BAD_REQUEST);
    }

    const user: User = await this.usersService.publicUser(loginUserDto.email);
    const token: string = await this.tokenService.generateJwtToken(existUser);
    return { user, token };
  }
}
