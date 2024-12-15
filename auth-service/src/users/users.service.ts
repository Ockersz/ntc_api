/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserNtcDto } from 'src/auth/dto/create-ntc-user.dto';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { User } from 'src/auth/entities/user.entity';
import { Common } from 'src/common/common';
import { Role } from 'src/roles/entities/role.entity';
import { UserRole } from 'src/roles/entities/user-role.entity';
import { DataSource, In, Repository } from 'typeorm';
import { ShowUserDto } from './dto/show-user.dto';
import { EmailQueueService } from './emailQueue';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createUserDto: CreateUserNtcDto): Promise<User> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
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

      const password = this.generateRandomPassword();

      const createdUser = await this.usersRepository.save(
        this.usersRepository.create({
          ...createUserDto,
          password: await Common.hashPassword(password),
        }),
      );

      if (createUserDto.roles && createUserDto.roles.length > 0) {
        const roles = await this.rolesRepository.find({
          where: { roleId: In(createUserDto.roles) },
        });
        if (roles.length !== createUserDto.roles.length) {
          throw new NotFoundException('Role not found');
        }

        const userRoles = roles.map((role) => {
          return this.userRoleRepository.create({
            role,
            userId: createdUser.userId,
          });
        });

        await this.userRoleRepository.save(userRoles);
      }

      const emailBody = `
       <div style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f9f9f9; padding: 20px; color: #333;">
          <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <div style="padding: 20px; text-align: center; background-color: #4CAF50; border-radius: 8px 8px 0 0; color: #ffffff;">
              <h1 style="margin: 0; font-size: 24px;">Welcome to NTC!</h1>
            </div>
            <div style="padding: 20px;">
              <p style="font-size: 18px;">Hi <strong>${createUserDto.firstName}</strong>,</p>
              <p style="font-size: 16px;">We’re thrilled to welcome you to the NTC family! Below, you’ll find your login details:</p>
              <div style="background-color: #f1f1f1; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <ul style="list-style-type: none; padding: 0; font-size: 16px; margin: 0;">
                  <li><strong>Username:</strong> ${createUserDto.username}</li>
                  <li><strong>Password:</strong> ${password}</li>
                </ul>
              </div>
              <p style="color: #d9534f; font-size: 16px;"><strong>Important:</strong> Please update your password after your first login for security purposes.</p>
              <p style="font-size: 16px;">If you have any questions or need assistance, don’t hesitate to reach out to us.</p>
              <p style="margin: 30px 0 0; font-size: 16px;">Welcome aboard!</p>
              <p style="margin: 0; font-size: 16px;">Best regards,</p>
              <p style="margin: 0; font-size: 16px; font-weight: bold;">The NTC Team</p>
            </div>
            <div style="padding: 20px; background-color: #f1f1f1; border-radius: 0 0 8px 8px; text-align: center; font-size: 14px; color: #777;">
              <p style="margin: 0;">Follow us on:</p>
              <div style="margin: 10px 0;">
                <a href="#" style="margin: 0 5px; text-decoration: none; color: #4CAF50;">Facebook</a> |
                <a href="#" style="margin: 0 5px; text-decoration: none; color: #4CAF50;">Twitter</a> |
                <a href="#" style="margin: 0 5px; text-decoration: none; color: #4CAF50;">LinkedIn</a>
              </div>
              <p style="margin: 10px 0 0;">© 2024 NTC Corporation. All Rights Reserved.</p>
            </div>
          </div>
        </div>
      `;

      const configService = new ConfigService();

      configService.set('AWS_ACCESS_KEY_ID', process.env.AWS_ACCESS_KEY_ID);
      configService.set(
        'AWS_SECRET_ACCESS_KEY',
        process.env.AWS_SECRET_ACCESS_KEY,
      );
      configService.set('AWS_REGION', process.env.AWS_REGION);

      const emailQueueService = new EmailQueueService(configService);
      emailQueueService.sendMessageToSQS({
        subject: 'Welcome to NTC!',
        body: emailBody,
        recipient: createUserDto.email,
      });
      await queryRunner.rollbackTransaction();

      return createdUser;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  generateRandomPassword() {
    const length = 8;
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let retVal = '';
    for (let i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }

  async findOne(id: number): Promise<ShowUserDto> {
    const user = await this.usersRepository.findOne({
      where: { userId: id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      status: user.status,
      roles: await this.findRoles(user.userId),
    };
  }

  async findRoles(id: number) {
    const userRoles = await this.userRoleRepository.find({
      select: ['role'],
      relations: ['role'],
      where: { userId: id },
    });

    if (!userRoles) {
      throw new NotFoundException('User not found');
    }

    const roles = userRoles.map((role) => role.role);

    if (!roles || roles.length === 0) {
      throw new NotFoundException('Role not found');
    }

    return roles;
  }

  async assignRole(id: number, roles: number[]) {
    const user = await this.usersRepository.findOne({
      where: { userId: id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userRoles = await this.userRoleRepository.find({
      where: { userId: id, roleId: In(roles) },
    });

    if (userRoles.length > 0) {
      throw new ConflictException('Role already assigned');
    }

    try {
      const userRoles = roles.map((roleId) => {
        return this.userRoleRepository.create({
          role: { roleId },
          userId: id,
        });
      });

      return await this.userRoleRepository.save(userRoles);
    } catch (error) {
      throw error;
    }
  }

  update(id: number, updateUserDto: CreateUserDto) {
    throw new NotFoundException('Method not found');
  }
}
