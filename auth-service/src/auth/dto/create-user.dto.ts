import { IsEmail, IsString } from 'class-validator';
import { IsPassword, IsUsername } from 'src/common/dataValidator';

export class CreateUserDto {
  @IsString({ message: 'First name must be a string' })
  firstName: string;

  @IsString({ message: 'Last name must be a string' })
  lastName: string;

  @IsEmail(
    {
      allow_ip_domain: false,
      allow_utf8_local_part: true,
      require_tld: true,
    },
    { message: 'Email must be a valid email address' },
  )
  email: string;

  @IsUsername({
    message: 'Username must be all lowercase and at least 7 characters long',
  })
  username: string;

  @IsPassword()
  password: string;
}
