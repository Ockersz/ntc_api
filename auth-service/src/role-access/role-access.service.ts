import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleAccessDto } from './dto/create-role-access.dto';
import { UpdateRoleAccessDto } from './dto/update-role-access.dto';
import { RoleAccess } from './entities/role-access.entity';

@Injectable()
export class RoleAccessService {
  constructor(
    @InjectRepository(RoleAccess)
    private roleAccessRepository: Repository<RoleAccess>,
  ) {}

  create(createRoleAccessDto: CreateRoleAccessDto) {}

  findAll() {
    return `This action returns all roleAccess`;
  }

  findOne(id: number) {
    return `This action returns a #${id} roleAccess`;
  }

  update(id: number, updateRoleAccessDto: UpdateRoleAccessDto) {
    return `This action updates a #${id} roleAccess`;
  }

  remove(id: number) {
    return `This action removes a #${id} roleAccess`;
  }
}
