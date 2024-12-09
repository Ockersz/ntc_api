import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { CreateRoleAccessDto } from './create-role-access.dto';

export class UpdateRoleAccessDto extends PartialType(CreateRoleAccessDto) {
  @ApiProperty({
    example: 'UserAllAccess',
    description: 'Name of the role',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'users',
    description: 'Resource to access',
    required: true,
  })
  @IsString()
  resource: string;

  @ApiProperty({
    example: ['read', 'write'],
    description: 'Access type',
    required: true,
  })
  @IsEnum(['read', 'write', 'delete', 'update'], { each: true })
  accessType: string[]; // Use accessTypes to match the payload
}
