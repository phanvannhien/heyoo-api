import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminPaymentController } from './admin-payment.controller';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PaymentSchema } from './schemas/payment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Payment', schema: PaymentSchema },
    ])
  ],
  controllers: [PaymentController, AdminPaymentController],
  providers: [PaymentService],
  exports: [
    PaymentService
  ]
})
export class PaymentModule {}
