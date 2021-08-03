import { Module } from '@nestjs/common';
import { NewsCategoriesService } from './news-categories.service';
import { NewsCategoriesController } from './news-categories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { NewsCategoriesSchema } from './schemas/news-categories.schema';
import { AdminNewsCategoriesController } from './admin-news-categories.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'NewsCategories', schema: NewsCategoriesSchema }])
  ],
  controllers: [NewsCategoriesController, AdminNewsCategoriesController],
  providers: [NewsCategoriesService]
})
export class NewsCategoriesModule {}
