import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthGuard } from 'src/auth.guard';
import { DataSanitizer } from 'src/common/dataSanitizer';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // User registration
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 409, description: 'Username or email already exists' })
  @ApiResponse({ status: 500, description: 'Server Error' })
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const sanitizedUser: CreateUserDto = DataSanitizer.sanitize(createUserDto);
    return this.authService.register(sanitizedUser);
  }

  // User login
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 400, description: 'Invalid credentials' })
  @ApiResponse({ status: 500, description: 'Server Error' })
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const sanitizedUser: LoginUserDto = DataSanitizer.sanitize(loginUserDto);

    const { accessToken, refreshToken, firstLogin } =
      await this.authService.login(sanitizedUser);

    return {
      message: 'Login successful',
      accessToken,
      refreshToken,
      firstLogin,
    };
  }

  @Get()
  getHello(): string {
    return 'Hello World!';
  }

  @UseGuards(AuthGuard)
  @Put('change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Request() req: any,
  ) {
    const sanitizedChangePassword: ChangePasswordDto =
      DataSanitizer.sanitize(changePasswordDto);
    return this.authService.changePassword(
      sanitizedChangePassword,
      req.user.sub,
    );
  }

  // Refresh access token
  @ApiResponse({ status: 200, description: 'Tokens refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  @ApiResponse({ status: 500, description: 'Server Error' })
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
