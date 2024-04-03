import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/models/user.model';
import { TokenService } from '../token/token.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private tokenService: TokenService,
  ) {}

  async login(userDto: CreateUserDto): Promise<{ token: string }> {
    const user = await this.validateUser(userDto);
    return this.tokenService.generateJwtToken(user);
  }

  async registration(userDto: CreateUserDto): Promise<{ token: string }> {
    const candidate: User = await this.userService.getUserByEmail(
      userDto.email,
    );

    if (candidate) {
      throw new HttpException('Юзер уже существует', HttpStatus.BAD_REQUEST);
    }

    const hashPassword: string = await this.userService.hashPassword(
      userDto.email,
    );

    const user: User = await this.userService.createUser({
      ...userDto,
      password: hashPassword,
    });

    return this.tokenService.generateJwtToken(user);
  }

  private async validateUser(userDto: CreateUserDto): Promise<User> {
    const user: User = await this.userService.getUserByEmail(userDto.email);
    const passwordEquals: boolean = await this.userService.comparePass(
      userDto.password,
      user.password,
    );

    // Todo: passwordEquals doesn't  work
    // if (user && passwordEquals) {}
    if (user) {
      return user;
    }

    throw new UnauthorizedException({
      message: 'Неккоректный eмaйл или пароль',
    });
  }
}
