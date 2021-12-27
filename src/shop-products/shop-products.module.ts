import { Module } from '@nestjs/common';
import { ShopProductsController } from './shop-products.controller';
import { ShopProductsService } from './shop-products.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesModule } from 'src/files/files.module';
import { ShopProductSchema } from './schemas/shop-product.schema';
import { AdminShopProductsController } from './admin-shop-products.controller';
import { ShopModule } from 'src/shop/shop.module';
import { ShopProductCategoryModule } from 'src/shop-products-category/shop-products-category.module';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'ShopProduct', schema: ShopProductSchema },
    ]),
    FilesModule,
    ShopModule,
    ShopProductCategoryModule
  ],
  controllers: [ShopProductsController, AdminShopProductsController],
  providers: [ShopProductsService],
  exports:[
    ShopProductsService
  ]
})
export class ShopProductsModule {}
