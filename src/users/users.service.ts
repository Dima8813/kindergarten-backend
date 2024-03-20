import { Injectable } from '@nestjs/common';
import { usersData } from '../moks';

@Injectable()
export class UsersService {
  getUsers(): any {
    return usersData;
  }
}
