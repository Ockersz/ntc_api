import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { IsPassword, IsUsername } from 'src/common/dataValidator';

export class CreateUserDto {
  @ApiProperty({
    example: 'John',
    description: 'The first name of the user',
  })
  @IsString({ message: 'First name must be a string' })
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'The last name of the user',
  })
  @IsString({ message: 'Last name must be a string' })
  lastName: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'The email address of the user',
  })
  @IsEmail(
    {
      allow_ip_domain: false,
      allow_utf8_local_part: true,
      require_tld: true,
    },
    { message: 'Email must be a valid email address' },
  )
  email: string;

  @ApiProperty({
    example: 'johndoe',
    description: 'The username of the user',
  })
  @IsUsername({
    message: 'Username must be all lowercase and at least 7 characters long',
  })
  username: string;

  @ApiProperty({
    example: 'password',
    description: 'The password of the user',
  })
  @IsPassword()
  password: string;
}
