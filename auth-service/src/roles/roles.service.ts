import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleAccess } from 'src/role-access/entities/role-access.entity';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(RoleAccess)
    private roleAccessRepository: Repository<RoleAccess>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const ifRoleExists = await this.roleRepository.findOne({
      where: { name: createRoleDto.name },
    });

    if (ifRoleExists) {
      throw new ConflictException('Role already exists');
    }

    return this.roleRepository.save(createRoleDto);
  }

  async createRoleAccess(roleId: number, roleAccessIds: number[]) {
    const role = await this.roleRepository.findOne({ where: { roleId } });

    if (!role) {
      throw new NotFoundException('Role not found');
    }
    role.access = role.access || [];
    const duplicateAccessIds = roleAccessIds.filter((id) =>
      role.access.includes(id),
    );
    if (duplicateAccessIds.length > 0) {
      throw new ConflictException(
        `Role access already assigned: ${duplicateAccessIds.join(', ')}`,
      );
    }

    role.access = [...new Set([...role.access, ...roleAccessIds])];

    try {
      return await this.roleRepository.save(role);
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    return this.roleRepository.find();
  }

  findOne(id: number) {
    return this.roleRepository.findOne({
      where: { roleId: id },
    });
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return this.roleRepository.update(id, updateRoleDto);
  }

  remove(id: number) {
    return this.roleRepository.delete(id);
  }
}
