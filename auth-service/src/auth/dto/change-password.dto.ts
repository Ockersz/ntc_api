import { ApiProperty } from '@nestjs/swagger';
import { IsPassword } from 'src/common/dataValidator';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'password',
    description: 'The old password of the user',
  })
  @IsPassword()
  currentPassword: string;

  @ApiProperty({
    example: 'password',
    description: 'The new password of the user',
  })
  @IsPassword()
  newPassword: string;
}
