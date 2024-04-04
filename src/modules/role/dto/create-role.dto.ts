import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty()
  @IsString()
  readonly value: string;

  @ApiProperty()
  @IsString()
  readonly description: string;
}
