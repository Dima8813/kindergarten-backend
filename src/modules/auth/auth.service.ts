import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDTO } from '../users/dto';
import { UsersService } from '../users/users.service';
import { AppErrors } from '../../common/consts/errors';
import { UserLoginDTO } from './dto';
import { User } from '../users/models/user.model';

import * as bcrypt from 'bcrypt';
import { AuthUserResponse } from './response';
import { TokenService } from '../token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
  ) {}
  async registerUsers(dto: CreateUserDTO): Promise<CreateUserDTO> {
    const existUser: User = await this.usersService.findUserByEmail(dto.email);

    if (existUser) throw new BadRequestException(AppErrors.USER_EXIST);

    return this.usersService.createUser(dto);
  }

  async loginUsers(dto: UserLoginDTO): Promise<AuthUserResponse> {
    const existUser: User = await this.usersService.findUserByEmail(dto.email);
    if (!existUser) throw new BadRequestException(AppErrors.USER_NOT_EXIST);

    const validatePassword: boolean = await bcrypt.compare(
      dto.password,
      existUser.password,
    );

    if (!validatePassword) throw new BadRequestException(AppErrors.WRONG_DATA);
    const user = await this.usersService.publicUser(dto.email);

    const token: string = await this.tokenService.generateJwtToken(user);

    return { user, token };
  }
}
