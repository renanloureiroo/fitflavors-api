import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '../env';
import { StorageGateway } from '@/domain/meals/gateways/storage.gateway';
import { Readable } from 'node:stream';

/**
 * Implementação do StorageGateway usando AWS S3
 * Esta é a implementação concreta na camada de infraestrutura
 */
export class S3StorageGateway implements StorageGateway {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor() {
    this.bucketName = env.AWS_S3_BUCKET_NAME ?? '';

    this.s3Client = new S3Client();
  }

  async uploadFile(key: string): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const presignedURL = await getSignedUrl(this.s3Client, command, {
        expiresIn: 600,
      });

      return presignedURL;
    } catch (error) {
      throw new Error(
        `S3_UPLOAD_ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async getFile(key: string): Promise<Buffer> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });
      const { Body } = await this.s3Client.send(command);

      if (!Body || !(Body instanceof Readable)) {
        throw new Error('S3_GET_FILE_ERROR: File not found');
      }
      const chunks = [];

      for await (const chunk of Body) {
        chunks.push(chunk);
      }

      return Buffer.concat(chunks);
    } catch (error) {
      console.log('error', error);
      throw new Error(
        `S3_GET_FILE_ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
