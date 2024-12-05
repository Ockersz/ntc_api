import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { RoleAccess } from './entities/roles-access.entity';
import { UserRole } from './entities/user-role.entity';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([Role, RoleAccess, UserRole]),
  ],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
