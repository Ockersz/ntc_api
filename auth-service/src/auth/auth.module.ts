import { Module } from '@nestjs/common';
import { DynamoDBModule } from '../common/dynamodb/dynamodb.module'; // Adjust the path if necessary
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [DynamoDBModule], // Import the module
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
