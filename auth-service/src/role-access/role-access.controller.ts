import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoleAccessService } from './role-access.service';
import { CreateRoleAccessDto } from './dto/create-role-access.dto';
import { UpdateRoleAccessDto } from './dto/update-role-access.dto';

@Controller('role-access')
export class RoleAccessController {
  constructor(private readonly roleAccessService: RoleAccessService) {}

  @Post()
  create(@Body() createRoleAccessDto: CreateRoleAccessDto) {
    return this.roleAccessService.create(createRoleAccessDto);
  }

  @Get()
  findAll() {
    return this.roleAccessService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleAccessService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleAccessDto: UpdateRoleAccessDto) {
    return this.roleAccessService.update(+id, updateRoleAccessDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleAccessService.remove(+id);
  }
}
