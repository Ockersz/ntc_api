import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/user.entity';
import { Role } from './roles/entities/role.entity';
import { RoleAccess } from './roles/entities/roles-access.entity';
import { UserRole } from './roles/entities/user-role.entity';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { RoleAccessModule } from './role-access/role-access.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the .env variables accessible across the app
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Role, UserRole, RoleAccess],
      synchronize: false,
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    RoleAccessModule,
  ],
})
export class AppModule {}
