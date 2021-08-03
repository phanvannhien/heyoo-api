import { Module } from '@nestjs/common';
import { ShopCategoriesService } from './shop-categories.service';
import { ShopCategoriesController } from './shop-categories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ShopCategoriesSchema } from './schemas/shop-categories.schema';
import { AdminShopCategoriesController } from './admin-shop-categories.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ShopCategories', schema: ShopCategoriesSchema }])
  ],
  controllers: [ShopCategoriesController, AdminShopCategoriesController],
  providers: [ShopCategoriesService],
  exports: [
    ShopCategoriesService
  ]
})
export class ShopCategoriesModule {}
