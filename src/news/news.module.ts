import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { MongooseModule } from '@nestjs/mongoose';
import { NewsSchema } from './schemas/news.schema';
import { FilesModule } from 'src/files/files.module';
import { NewsCategoriesModule } from 'src/news-categories/news-categories.module';


@Module({

  imports: [
    MongooseModule.forFeature([
      { name: 'News', schema: NewsSchema },
    ]),
    FilesModule,
    NewsCategoriesModule,
  ],
  controllers: [NewsController],
  providers: [NewsService],
  exports:[
    NewsService
  ]
})
export class NewsModule {}
