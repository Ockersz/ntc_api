import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { CreateRoleAccessDto } from './dto/create-role-access.dto';
import { UpdateRoleAccessDto } from './dto/update-role-access.dto';
import { RoleAccessService } from './role-access.service';

@Controller('role-access')
export class RoleAccessController {
  constructor(private readonly roleAccessService: RoleAccessService) {}

  @ApiResponse({ status: 201, description: 'Role Access created successfully' })
  @ApiResponse({ status: 409, description: 'Role Access already exists' })
  @ApiResponse({ status: 500, description: 'Server Error' })
  @Post()
  async create(@Body() createRoleAccessDto: CreateRoleAccessDto) {
    return await this.roleAccessService.create(createRoleAccessDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Role Access retrieved successfully',
  })
  @Get()
  findAll() {
    return this.roleAccessService.findAll();
  }

  @ApiResponse({
    status: 200,
    description: 'Role Access retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Role Access not found' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.roleAccessService.findOne(+id);
  }

  @ApiResponse({
    status: 200,
    description: 'Role Access updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Role Access not found' })
  @ApiResponse({ status: 409, description: 'Role Access already exists' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRoleAccessDto: UpdateRoleAccessDto,
  ) {
    return await this.roleAccessService.update(+id, updateRoleAccessDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Role Access deleted successfully',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleAccessService.remove(+id);
  }
}
