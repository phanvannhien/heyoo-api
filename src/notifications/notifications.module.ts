import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationSchema } from './schemas/notification.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { NOTIFICATION_MODEL } from 'src/mongo-model.constance';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NOTIFICATION_MODEL, schema: NotificationSchema },
    ]),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports:[
    NotificationsService
  ]
})
export class NotificationsModule {}
