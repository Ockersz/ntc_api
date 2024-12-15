import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

interface MessageBody {
  subject: string;
  body: string;
  recipient: string;
}

@Injectable()
export class EmailQueueService {
  private readonly sqs: AWS.SQS;
  private readonly queueUrl: string;
  private readonly logger = new Logger(EmailQueueService.name);

  constructor(private configService: ConfigService) {
    this.sqs = new AWS.SQS();
    this.queueUrl = this.configService.get<string>('QUEUE_URL')!;

    AWS.config.update({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get<string>('AWS_REGION'),
    });
  }

  async sendMessageToSQS(messageBody: MessageBody): Promise<void> {
    const params = {
      QueueUrl: this.queueUrl,
      MessageBody: JSON.stringify(messageBody),
    };

    try {
      await this.sqs.sendMessage(params).promise();
    } catch (error) {
      this.logger.error(
        'Error sending message to SQS:',
        (error as Error).message,
      );
    }
  }
}
