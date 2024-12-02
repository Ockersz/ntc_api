import { IsPassword, IsUsername } from 'src/common/dataValidator';

export class LoginUserDto {
  @IsUsername()
  username: string;

  @IsPassword()
  password: string;
}
