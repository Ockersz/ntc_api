/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { UserRole } from 'src/roles/entities/user-role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
  ) {}

  create(createUserDto: CreateUserDto) {
    throw new NotFoundException('Method not found');
  }

  findAll() {
    throw new NotFoundException('Method not found');
  }

  findOne(id: number) {
    throw new NotFoundException('Method not found');
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

  remove(id: number) {
    throw new NotFoundException('Method not found');
  }
}
