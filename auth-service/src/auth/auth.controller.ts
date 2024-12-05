import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { DataSanitizer } from 'src/common/dataSanitizer';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // User registration
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const sanitizedUser: CreateUserDto = DataSanitizer.sanitize(createUserDto);
    return this.authService.register(sanitizedUser);
  }

  // User login
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const sanitizedUser: LoginUserDto = DataSanitizer.sanitize(loginUserDto);

    const { accessToken, refreshToken } =
      await this.authService.login(sanitizedUser);

    return {
      message: 'Login successful',
      accessToken,
      refreshToken,
    };
  }

  // Refresh access token
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    const sanitizedRefreshToken = DataSanitizer.sanitize(refreshTokenDto);

    const { accessToken, refreshToken } = await this.authService.refreshToken(
      sanitizedRefreshToken,
    );

    return {
      message: 'Tokens refreshed successfully',
      accessToken,
      refreshToken,
    };
  }
}
