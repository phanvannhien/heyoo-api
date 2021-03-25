import { Module, forwardRef } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from './schemas/order.schema';
import { ProductsModule } from 'src/products/products.module';
import { UsersModule } from 'src/users/users.module';
import { WalletsModule } from 'src/wallets/wallets.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Order', schema: OrderSchema }
        ]),
        ProductsModule,
        WalletsModule,
        forwardRef(() => UsersModule)
    ],
    providers: [OrdersService],
    controllers: [OrdersController],
    exports: [
        OrdersService
    ]
})
export class OrdersModule {}
