import { Module } from '@nestjs/common';
import { ShopProductCategoryService } from './shop-products-category.service';
import { ShopProductCategoryController } from './shop-products-category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ShopProductCategorySchema } from './schemas/shop-products-category.schema';
import { AdminShopProductCategoryController } from './admin-shop-products-category.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ShopProductCategories', schema: ShopProductCategorySchema }])
  ],
  controllers: [ShopProductCategoryController, AdminShopProductCategoryController],
  providers: [ShopProductCategoryService],
  exports: [
    ShopProductCategoryService
  ]
})
export class ShopProductCategoryModule {}
