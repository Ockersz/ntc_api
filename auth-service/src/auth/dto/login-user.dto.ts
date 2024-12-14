import { ApiProperty } from '@nestjs/swagger';
import { IsPassword, IsUsername } from 'src/common/dataValidator';

export class LoginUserDto {
  @ApiProperty({
    example: 'johndoe',
    description: 'The username of the user',
  })
  @IsUsername()
  username: string;

  @ApiProperty({
    example: 'password',
    description: 'The password of the user',
  })
  @IsPassword()
  password: string;
}
