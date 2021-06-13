import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesSchema } from './schemas/categories.schema';
import { LivestreamsModule } from 'src/livestreams/livestreams.module';
import { LiveStreamSchema } from 'src/livestreams/schemas/livestream.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Categories', schema: CategoriesSchema },
      { name: 'LiveStreams', schema: LiveStreamSchema },
    ]),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService]
})
export class CategoriesModule {}
