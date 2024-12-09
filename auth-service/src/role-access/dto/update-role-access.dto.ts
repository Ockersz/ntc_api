import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { CreateRoleAccessDto } from './create-role-access.dto';

export class UpdateRoleAccessDto extends PartialType(CreateRoleAccessDto) {
  @IsString()
  resource: string;

  @IsEnum(['read', 'write', 'delete', 'update'], { each: true })
  accessType: string[]; // Use accessTypes to match the payload
}
