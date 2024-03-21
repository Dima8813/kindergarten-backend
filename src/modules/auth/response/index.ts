import { IsString } from 'class-validator';

export class AuthUserResponse {
  @IsString()
  firstName: string;

  @IsString()
  surname: string;

  @IsString()
  email: string;

  @IsString()
  password: string;
}
