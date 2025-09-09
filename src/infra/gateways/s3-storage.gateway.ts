import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl as getSignedUrlPresigner } from '@aws-sdk/s3-request-presigner';
import { env } from '../env';
import { StorageGateway } from '@/domain/meals/gateways/storage.gateway';

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

  async uploadFile(key: string): Promise<void> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
    } catch (error) {
      throw new Error(
        `S3_UPLOAD_ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async getSignedUrl(key: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return await getSignedUrlPresigner(this.s3Client, command, {
      expiresIn: 3600,
    });
  }
}
