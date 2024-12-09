import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CreateUserNtcDto } from 'src/auth/dto/create-ntc-user.dto';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { ShowUserDto } from './dto/show-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({
    status: 409,
    description: 'Username or email already exists.',
  })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @Post()
  create(@Body() createUserDto: CreateUserNtcDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiResponse({
    status: 200,
    description: 'The user has been successfully found.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiParam({ name: 'id', type: 'number', required: true })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ShowUserDto> {
    return await this.usersService.findOne(+id);
  }

  @ApiResponse({
    status: 200,
    description: 'The user has been successfully found.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiParam({ name: 'id', type: 'number', required: true })
  @Get(':id/roles')
  async findRoles(@Param('id') id: string) {
    return await this.usersService.findRoles(+id);
  }

  @ApiResponse({
    status: 200,
    description: 'The role has been successfully assigned.',
  })
  @ApiResponse({ status: 404, description: 'User or Role not found.' })
  @ApiResponse({ status: 409, description: 'Role already assigned.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiParam({ name: 'id', type: 'number', required: true })
  @ApiBody({
    type: [Number],
  })
  @Post(':id/roles')
  async assignRole(@Param('id') id: string, @Body() roles: number[]) {
    return await this.usersService.assignRole(+id, roles);
  }

  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({
    status: 409,
    description: 'Username or email already exists.',
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: CreateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }
}
