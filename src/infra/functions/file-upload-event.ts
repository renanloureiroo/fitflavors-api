import { S3Event } from 'aws-lambda';
import { SQSQueueGateway } from '../gateways/sqs-queue.gateway';

export async function handler(event: S3Event) {
  const sqsQueueGateway = new SQSQueueGateway();
  await Promise.all(
    event.Records.map(async record => {
      const {
        object: { key },
      } = record.s3;
      console.log(record.eventName);
      console.log(`File uploaded to ${key}`);

      await sqsQueueGateway.sendMessage(
        JSON.stringify({
          fileKey: key,
        })
      );
    })
  );
}
