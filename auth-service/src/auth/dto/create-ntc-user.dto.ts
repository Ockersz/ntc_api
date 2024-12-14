import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsString } from 'class-validator';
import { IsPassword, IsUsername } from 'src/common/dataValidator';

export class CreateUserNtcDto {
  @ApiProperty({
    example: 'John',
    description: 'First name of the user',
    required: true,
  })
  @IsString({ message: 'First name must be a string' })
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Last name of the user',
    required: true,
  })
  @IsString({ message: 'Last name must be a string' })
  lastName: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address of the user',
    required: true,
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
    description: 'Username of the user',
    required: true,
  })
  @IsUsername({
    message: 'Username must be all lowercase and at least 7 characters long',
  })
  username: string;

  @ApiProperty({
    example: 'password',
    description: 'Password of the user',
    required: true,
  })
  @IsPassword()
  password: string;

  @ApiProperty({
    example: [1, 2],
    description: 'Roles of the user',
    required: false,
  })
  @IsArray()
  roles: number[];
}
