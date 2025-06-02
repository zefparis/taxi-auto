import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

type File = {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  size: number;
};

type FileMetadata = {
  [key: string]: string | number | boolean | null | undefined;
};

export class S3Service {
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || 
        !process.env.AWS_REGION || !process.env.S3_BUCKET_NAME || !process.env.S3_BASE_PATH) {
      throw new Error('AWS credentials or S3 configuration not complete');
    }

    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    this.bucketName = process.env.S3_BUCKET_NAME;
  }

  private getFullKey(key: string): string {
    // Ensure the key doesn't start with a slash and is properly joined with the base path
    const cleanKey = key.startsWith('/') ? key.substring(1) : key;
    return `${process.env.S3_BASE_PATH}${cleanKey}`;
  }

  async uploadFile(file: File, key: string, metadata: FileMetadata = {}): Promise<string> {
    const fullKey = this.getFullKey(key);
    // Convert metadata to S3 metadata format
    const s3Metadata = Object.entries(metadata).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        acc[`x-amz-meta-${key}`] = String(value);
      }
      return acc;
    }, {} as Record<string, string>);

    const params = {
      Bucket: this.bucketName,
      Key: fullKey,
      Body: file.buffer,
      ContentType: file.mimetype,
      Metadata: s3Metadata,
      ContentLength: file.size,
    };

    await this.s3Client.send(new PutObjectCommand(params));
    return key;
  }

  async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
    const fullKey = this.getFullKey(key);
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fullKey,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn });
  }

  async deleteFile(key: string): Promise<void> {
    const fullKey = this.getFullKey(key);
    const params = {
      Bucket: this.bucketName,
      Key: fullKey,
    };

    await this.s3Client.send(new DeleteObjectCommand(params));
  }
}

export const s3Service = new S3Service();
