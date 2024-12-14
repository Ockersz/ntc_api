import { IsEnum, IsString } from 'class-validator';

export class CreateRoleAccessDto {
  @IsString()
  resource: string;

  @IsEnum(['read', 'write', 'delete', 'update'], { each: true })
  accessType: string[]; // Use accessTypes to match the payload
}
