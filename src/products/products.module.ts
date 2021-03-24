import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesModule } from 'src/files/files.module';
import { ProductSchema } from './schemas/product.schema';

@Module({

  imports: [
    MongooseModule.forFeature([
      { name: 'Product', schema: ProductSchema },
    ]),
    FilesModule
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports:[
    ProductsService
  ]
})
export class ProductsModule {}
