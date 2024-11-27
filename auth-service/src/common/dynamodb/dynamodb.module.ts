import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'DYNAMO_DB',
      useFactory: (configService: ConfigService) => {
        const client = new DynamoDBClient({
          region: configService.get<string>('AWS_REGION'),
          credentials: {
            accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID'),
            secretAccessKey: configService.get<string>('AWS_SECRET_ACCESS_KEY'),
          },
        });
        return DynamoDBDocumentClient.from(client);
      },
      inject: [ConfigService],
    },
  ],
  exports: ['DYNAMO_DB'], // Export the provider
})
export class DynamoDBModule {}
