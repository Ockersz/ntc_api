import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Common } from 'src/common/common';
import { Role } from 'src/roles/entities/role.entity';
import { UserRole } from 'src/roles/entities/user-role.entity';
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
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,

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

    const createdUser = await this.usersRepository.save(
      this.usersRepository.create({
        ...createUserDto,
        password: await Common.hashPassword(createUserDto.password),
      }),
    );

    //apply default roles
    const defaultRoles = await this.roleRepository.find({
      where: { default: 1 },
    });

    if (defaultRoles.length > 0) {
      const userRoles = defaultRoles.map((role) => {
        return this.userRoleRepository.create({
          role,
          userId: createdUser.userId,
        });
      });

      await this.roleRepository.save(userRoles);
    }

    return createdUser;
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.usersRepository.findOne({
      where: { username: loginUserDto.username },
    });

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isValidPassword = await Common.validatePassword(
      loginUserDto.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new BadRequestException('Invalid credentials');
    }

    const refreshToken = await this.jwtService.signAsync(
      { sub: user.userId, username: user.username },
      { expiresIn: '7d', secret: process.env.JWT_REFRESH_SECRET },
    );

    const payload = { sub: user.userId, username: user.username };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      secret: process.env.JWT_SECRET,
    });

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      // Verify the refresh token
      const payload = await this.jwtService.verifyAsync(
        refreshTokenDto.refreshToken,
        {
          secret: process.env.JWT_REFRESH_SECRET,
        },
      );

      if (!payload) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      // Generate a new access token and refresh token
      const newAccessToken = this.jwtService.sign(
        { sub: payload.sub, username: payload.username },
        { expiresIn: '15m', secret: process.env.JWT_SECRET },
      );

      const newRefreshToken = this.jwtService.sign(
        { sub: payload.sub, username: payload.username },
        { expiresIn: '7d', secret: process.env.JWT_REFRESH_SECRET },
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
}
