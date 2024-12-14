import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async create(createRoleAccessDto: CreateRoleAccessDto) {
    const isExist = await this.roleAccessRepository.findOne({
      where: {
        name: createRoleAccessDto.name,
        resource: createRoleAccessDto.resource,
      },
    });

    if (isExist) {
      throw new ConflictException('Role access already exists');
    }

    const roleAccess =
      await this.roleAccessRepository.create(createRoleAccessDto);
    return await this.roleAccessRepository.save(roleAccess);
  }

  findAll() {
    return this.roleAccessRepository.find();
  }

  async findOne(id: number) {
    const roleAccess = await this.roleAccessRepository.findOne({
      where: {
        accessId: id,
      },
    });

    if (!roleAccess) {
      throw new NotFoundException('Role access not found');
    }

    return roleAccess;
  }

  async update(id: number, updateRoleAccessDto: UpdateRoleAccessDto) {
    const ifExist = await this.roleAccessRepository.findOne({
      where: {
        name: updateRoleAccessDto.name,
        resource: updateRoleAccessDto.resource,
      },
    });

    if (!ifExist) {
      throw new NotFoundException('Role access not found');
    }

    if (ifExist && ifExist.accessId !== id) {
      throw new ConflictException('Role access already exists');
    }

    return this.roleAccessRepository.update(
      { accessId: id },
      updateRoleAccessDto,
    );
  }

  remove(id: number) {
    return this.roleAccessRepository.delete({ accessId: id });
  }
}
