import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FilesService {
  constructor(
    private readonly configService: ConfigService
  ) {}

  async uploadPublicFile(dataBuffer: Buffer, filename: string): Promise<string> {
    const s3 = new S3();
    const uploadResult = await s3.upload({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Body: dataBuffer,
        Key: `${uuid()}`,
        ContentType: "image/jpeg"
    }).promise();
    
    return `${process.env.CLOUD_FRONT_VIDEO_URL}/${uploadResult.Key}`;
  }

  async deletePublicFile(fileKey: string): Promise<Boolean> {
    const s3 = new S3();
    await s3.deleteObject({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Key: fileKey,
    }).promise();
    return true;
  }
}
