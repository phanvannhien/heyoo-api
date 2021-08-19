import { Module } from '@nestjs/common';
import { AdminUploadController } from './admin-upload.controller';
import { ImageUploadController } from './upload.controller';
import { ImageUploadService } from './upload.service';

@Module({
  controllers: [ImageUploadController, AdminUploadController],
  providers: [ImageUploadService],
  exports: [ImageUploadService],
})
export class ImageUploadModule {}