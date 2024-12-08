import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(+id);
  }

  @Get(':id/roles')
  async findRoles(@Param('id') id: string) {
    return await this.usersService.findRoles(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: CreateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }
}
