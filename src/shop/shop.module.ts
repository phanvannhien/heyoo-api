import { Module } from '@nestjs/common';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ShopSchema } from './schemas/shop.schema';
import { SHOP_MODEL,SHOP_FOLLOW_MODEL } from 'src/mongo-model.constance';
import { ShopCategoriesModule } from 'src/shop-categories/shop-categories.module';
import { ShopFollowSchema } from './schemas/follow.schema';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SHOP_MODEL, schema: ShopSchema },
      { name: SHOP_FOLLOW_MODEL, schema: ShopFollowSchema },
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
