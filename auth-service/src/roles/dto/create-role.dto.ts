import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Role name',
    example: 'Admin',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Role status',
    example: 1,
  })
  @IsNumber()
  status: number;

  @ApiProperty({
    description: 'Default role',
    example: 0,
  })
  @IsNumber()
  default: number;
}
