import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { DataSanitizer } from 'src/common/dataSanitizer';
import { AssignRoleDto } from './dto/assign-role.dto';
import { CreateRoleAccessDto } from './dto/create-role-access.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    const sanitizedRoleDto = DataSanitizer.sanitize(createRoleDto);
    return this.rolesService.create(sanitizedRoleDto);
  }

  @Post('/assign')
  async assignRoleAccess(@Body() assignRoleDto: AssignRoleDto) {
    const sanitizedRoleDto = DataSanitizer.sanitize(assignRoleDto);
    return await this.rolesService.assignRoleAccess(sanitizedRoleDto);
  }

  @Post(':roleId/access')
  async createRoleAccess(
    @Param('roleId') roleId: string,
    @Body() assignRoleDto: CreateRoleAccessDto,
  ) {
    const sanitizedRoleDto = DataSanitizer.sanitize(assignRoleDto);
    return await this.rolesService.createRoleAccess(+roleId, sanitizedRoleDto);
  }

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    const sanitizedRoleDto = DataSanitizer.sanitize(updateRoleDto);
    return this.rolesService.update(+id, sanitizedRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}
