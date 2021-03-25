import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionSchema } from './schemas/transaction.schema';
import { UsersModule } from 'src/users/users.module';
import { OrdersModule } from 'src/orders/orders.module';


@Module({
  imports: [
    MongooseModule.forFeature([
        { name: 'Transaction', schema: TransactionSchema }
    ]),
    UsersModule,
    OrdersModule,
  ],
  providers: [TransactionService],
  controllers: [TransactionController],
  exports: [
    TransactionService
  ]
})
export class TransactionModule {}
