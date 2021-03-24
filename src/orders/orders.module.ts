import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from './schemas/order.schema';
import { ProductsModule } from 'src/products/products.module';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Order', schema: OrderSchema }
        ]),
        ProductsModule,
        UsersModule
    ],
    providers: [OrdersService],
    controllers: [OrdersController]
})
export class OrdersModule {}
