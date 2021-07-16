import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NOTIFICATION_MODEL } from 'src/mongo-model.constance';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationEntityDocument } from './entities/notification.entity';
import * as mongoose from 'mongoose';

@Injectable()
export class NotificationsService {

  constructor(
    @InjectModel( NOTIFICATION_MODEL ) private readonly notyModel: Model<NotificationEntityDocument>,
  ){}

  async create(createNotificationDto: CreateNotificationDto): Promise<NotificationEntityDocument> {
    const notify = new this.notyModel( createNotificationDto );
    return await notify.save();
  }

  async createMany(createNotificationDto: Array<CreateNotificationDto>): Promise<any> {
    return await this.notyModel.insertMany(createNotificationDto)
  }

  async findAll(id: string): Promise<Array<NotificationEntityDocument>>  {
    return await this.notyModel.find({
      isRead: false,
      user: id
    }).exec();
  }

  async remove(id: string) {
    return await this.notyModel.findByIdAndDelete(id);
  }
}
