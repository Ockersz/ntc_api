import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth.guard';
import { DataSanitizer } from 'src/common/dataSanitizer';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesService } from './roles.service';

@UseGuards(AuthGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiResponse({
    status: 201,
    description: 'The role has been successfully created.',
  })
  @ApiResponse({ status: 409, description: 'Role already exists.' })
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    const sanitizedRoleDto = DataSanitizer.sanitize(createRoleDto);
    return this.rolesService.create(sanitizedRoleDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Role access assigned successfully',
  })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  @ApiResponse({ status: 409, description: 'Role access already assigned.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @Post(':roleId/access')
  async createRoleAccess(
    @Param('roleId') roleId: string,
    @Body() roleAccessIds: number[],
  ) {
    const sanitizedRoleDto = DataSanitizer.sanitize(roleAccessIds);
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
