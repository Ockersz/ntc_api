import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    example: '<refresh_token>',
    description: 'The refresh token to be used to refresh the access token',
  })
  @IsString()
  refreshToken: string;
}
