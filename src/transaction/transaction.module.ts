import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionSchema } from './schemas/transaction.schema';
import { UsersModule } from 'src/users/users.module';
import { OrdersModule } from 'src/orders/orders.module';
import { AdminTransactionController } from './admin-transaction.controller';
import { PackageModule } from 'src/packages/package.module';
import { PaymentModule } from 'src/payment/payment.module';


@Module({
  imports: [
    MongooseModule.forFeature([
        { name: 'Transaction', schema: TransactionSchema }
    ]),
    UsersModule,
    OrdersModule,
    PackageModule,
    PaymentModule,
  ],
  providers: [TransactionService],
  controllers: [TransactionController, AdminTransactionController ],
  exports: [
    TransactionService
  ]
})
export class TransactionModule {}
