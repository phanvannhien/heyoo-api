import { Module } from '@nestjs/common';
import { OtpsService } from './otps.service';
import { OtpsController } from './otps.controller';
import { OtpSchema } from './schemas/otp.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { SmsService } from './sms.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Otps', schema: OtpSchema }])
  ],
  controllers: [OtpsController],
  providers: [
    OtpsService,
    SmsService
  ],
  exports: [ OtpsService ]
})
export class OptsModule {}
