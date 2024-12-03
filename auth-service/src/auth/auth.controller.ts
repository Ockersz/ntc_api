import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
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
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    // Sanitize user input
    const sanitizedUser: LoginUserDto = DataSanitizer.sanitize(loginUserDto);

    // Get accessToken and refreshToken from AuthService
    const { accessToken, refreshToken } =
      await this.authService.login(sanitizedUser);

    // Return tokens in the response body
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
    // Sanitize refresh token
    const sanitizedRefreshToken = DataSanitizer.sanitize(refreshTokenDto);

    // Get new tokens from AuthService
    const { accessToken, refreshToken } = await this.authService.refreshToken(
      sanitizedRefreshToken,
    );

    // Return new tokens in the response body
    return {
      message: 'Tokens refreshed successfully',
      accessToken,
      refreshToken,
    };
  }
}
