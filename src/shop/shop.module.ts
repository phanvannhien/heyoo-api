import { Module } from '@nestjs/common';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ShopSchema } from './schemas/shop.schema';
import { SHOP_MODEL } from 'src/mongo-model.constance';
import { ShopCategoriesModule } from 'src/shop-categories/shop-categories.module';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SHOP_MODEL, schema: ShopSchema },
    ]),
    ShopCategoriesModule
  ],
  controllers: [ShopController],
  providers: [ShopService],
  exports:[
    ShopService
  ]
})
export class ShopModule {}
