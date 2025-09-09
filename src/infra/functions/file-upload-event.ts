import { S3Event } from 'aws-lambda';

export async function handler(event: S3Event) {
  await Promise.all(
    event.Records.map(async record => {
      const {
        bucket,
        object: { key },
      } = record.s3;
      console.log(`File uploaded to ${bucket}/${key}`);
    })
  );
}
