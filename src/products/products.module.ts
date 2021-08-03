import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesModule } from 'src/files/files.module';
import { ProductSchema } from './schemas/product.schema';
import { AdminProductsController } from './admin-products.controller';

@Module({

  imports: [
    MongooseModule.forFeature([
      { name: 'Product', schema: ProductSchema },
    ]),
    FilesModule
  ],
  controllers: [ProductsController, AdminProductsController],
  providers: [ProductsService],
  exports:[
    ProductsService
  ]
})
export class ProductsModule {}
