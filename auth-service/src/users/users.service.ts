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
import { Repository } from 'typeorm';
import { ShowUserDto } from './dto/show-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserNtcDto): Promise<User> {
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
    }

    return createdUser;
  }

  async findOne(id: number): Promise<ShowUserDto> {
    return (await this.usersRepository.findOne({
      where: { userId: id },
    })) as ShowUserDto;
  }

  async findRoles(id: number) {
    const userRoles = await this.userRoleRepository.find({
      select: ['role'],
      relations: ['role'],
      where: { userId: id },
    });

    return userRoles.map((role) => role.role);
  }

  update(id: number, updateUserDto: CreateUserDto) {
    throw new NotFoundException('Method not found');
  }
}
