import { Module } from '@nestjs/common';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { MongooseModule } from '@nestjs/mongoose';
import { VideosSchema } from './schemas/videos.schema';
import { FilesModule } from 'src/files/files.module';
import { VideoCategoriesModule } from 'src/video-categories/video-categories.module';
import { NotificationsModule } from 'src/notifications/notifications.module';


@Module({

  imports: [
    MongooseModule.forFeature([
      { name: 'videos', schema: VideosSchema },
    ]),
    FilesModule,
    VideoCategoriesModule,
    NotificationsModule
  ],
  controllers: [VideosController],
  providers: [VideosService],
  exports:[
    VideosService
  ]
})
export class VideosModule {}
