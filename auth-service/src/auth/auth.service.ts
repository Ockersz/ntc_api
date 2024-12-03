import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcryp from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { User } from './entities/user.entity';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<CreateUserDto | null> {
    const user = await this.usersRepository.findOne({
      where: { username: createUserDto.username },
    });

    if (user) {
      throw new ConflictException('Username already exists');
    }

    const email = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (email) {
      throw new ConflictException('Email already exists');
    }

    return await this.usersRepository.save(
      this.usersRepository.create({
        ...createUserDto,
        password: await this.hashPassword(createUserDto.password),
      }),
    );
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.usersRepository.findOne({
      where: { username: loginUserDto.username },
    });

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isValidPassword = await this.validatePassword(
      loginUserDto.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new BadRequestException('Invalid credentials');
    }

    const refreshToken = await this.jwtService.signAsync(
      { sub: user.userId, username: user.username },
      { expiresIn: '1d' },
    );

    const payload = { sub: user.userId, username: user.username };
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      // Verify the refresh token
      const payload = this.jwtService.verify(refreshTokenDto.refreshToken, {
        secret: process.env.REFRESH_SECRET,
      });

      // Generate a new access token and refresh token
      const newAccessToken = this.jwtService.sign(
        { sub: payload.sub, username: payload.username },
        { expiresIn: '15m' },
      );

      const newRefreshToken = this.jwtService.sign(
        { sub: payload.sub, username: payload.username },
        { expiresIn: '7d', secret: process.env.REFRESH_SECRET },
      );

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      const logger = new Logger('AuthService');
      logger.error(error.message);
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return bcryp.hash(password, await bcryp.genSalt());
  }

  private async validatePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return bcryp.compare(password, hash);
  }
}
