import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssignRoleDto } from './dto/assign-role.dto';
import { CreateRoleAccessDto } from './dto/create-role-access.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { RoleAccess } from './entities/roles-access.entity';
import { UserRole } from './entities/user-role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(RoleAccess)
    private roleAccessRepository: Repository<RoleAccess>,
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
  ) {}

  create(createRoleDto: CreateRoleDto) {
    return this.roleRepository.save(createRoleDto);
  }

  async assignRoleAccess(assignRoleDto: AssignRoleDto) {
    //check if role exists
    const role = await this.roleRepository.findOne({
      where: { roleId: assignRoleDto.roleId },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    //check if role access exists
    const roleAccess = await this.userRoleRepository.findOne({
      where: { roleId: assignRoleDto.roleId, userId: assignRoleDto.userId },
    });

    if (roleAccess) {
      //already assigned
      throw new ConflictException('Role already assigned');
    }

    try {
      return this.userRoleRepository.save(assignRoleDto);
    } catch (error) {
      Logger.error(error);
      throw new ConflictException('Role already assigned');
    }
  }

  async createRoleAccess(
    roleId: number,
    createRoleAccessDto: CreateRoleAccessDto,
  ) {
    const role = await this.roleRepository.findOne({ where: { roleId } });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const existingRoleAccess = await this.roleAccessRepository.findOne({
      where: { resource: createRoleAccessDto.resource },
    });

    if (existingRoleAccess) {
      // Merge new access types with existing ones
      const updatedAccessTypes = Array.from(
        new Set([
          ...existingRoleAccess.accessType,
          ...createRoleAccessDto.accessType,
        ]),
      );
      existingRoleAccess.accessType = updatedAccessTypes;

      return await this.roleAccessRepository.save(existingRoleAccess);
    }

    // Create a new role access entry
    const newRoleAccess = this.roleAccessRepository.create(createRoleAccessDto);
    return await this.roleAccessRepository.save(newRoleAccess);
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
