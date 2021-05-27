import { Module } from '@nestjs/common';
import { VideoCategoriesService } from './video-categories.service';
import { VideoCategoriesController } from './video-categories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { VideoCategoriesSchema } from './schemas/video-categories.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'VideoCategories', schema: VideoCategoriesSchema }])
  ],
  controllers: [VideoCategoriesController],
  providers: [VideoCategoriesService]
})
export class VideoCategoriesModule {}
