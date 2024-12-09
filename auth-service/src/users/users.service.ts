/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserNtcDto } from 'src/auth/dto/create-ntc-user.dto';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { User } from 'src/auth/entities/user.entity';
import { Common } from 'src/common/common';
import { UserRole } from 'src/roles/entities/user-role.entity';
import { DataSource, Repository } from 'typeorm';
import { ShowUserDto } from './dto/show-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
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

      const createdUser = await this.usersRepository.save(
        this.usersRepository.create({
          ...createUserDto,
          password: await Common.hashPassword(createUserDto.password),
        }),
      );

      if (createUserDto.roles) {
        const roles = await this.userRoleRepository.findByIds(
          createUserDto.roles,
        );

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

      await queryRunner.commitTransaction();

      return createdUser;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
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

  update(id: number, updateUserDto: CreateUserDto) {
    throw new NotFoundException('Method not found');
  }
}
