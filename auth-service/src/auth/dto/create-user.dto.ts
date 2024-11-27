import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty()
  username: string;

  @IsEmail(
    {
      allow_ip_domain: false,
      allow_utf8_local_part: true,
      require_tld: true,
    },
    { message: 'Email must be a valid email address' },
  )
  email: string;

  @IsString({ message: 'Password must be a string' })
  password: string;
}
