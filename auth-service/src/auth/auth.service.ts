import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';
import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject('DYNAMO_DB')
    private readonly dynamoDbClient: DynamoDBDocumentClient,
  ) {}

  private readonly TABLE_NAME = 'Users';

  async register(createUserDto: CreateUserDto): Promise<User> {
    const user: User = {
      userId: uuid(),
      username: createUserDto.username,
      email: createUserDto.email,
      passwordHash: await this.hashPassword(createUserDto.password),
      createdAt: new Date().toISOString(),
    };

    await this.dynamoDbClient.send(
      new PutCommand({
        TableName: this.TABLE_NAME,
        Item: user,
      }),
    );

    return user;
  }

  async login(loginUserDto: LoginUserDto): Promise<User | null> {
    const result = await this.dynamoDbClient.send(
      new GetCommand({
        TableName: this.TABLE_NAME,
        Key: { username: loginUserDto.username },
      }),
    );

    const user = result.Item as User;
    if (
      user &&
      (await this.validatePassword(loginUserDto.password, user.passwordHash))
    ) {
      return user;
    }

    return null;
  }

  private async hashPassword(password: string): Promise<string> {
    // Add bcrypt or similar for secure hashing
    return password; // Placeholder
  }

  private async validatePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    // Add bcrypt or similar for password validation
    return password === hash; // Placeholder
  }
}
