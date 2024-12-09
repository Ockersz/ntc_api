import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleAccess } from './entities/role-access.entity';
import { RoleAccessController } from './role-access.controller';
import { RoleAccessService } from './role-access.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([RoleAccess]),
  ],
  controllers: [RoleAccessController],
  providers: [RoleAccessService],
})
export class RoleAccessModule {}
