import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NOTIFICATION_MODEL } from 'src/mongo-model.constance';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationEntityDocument } from './entities/notification.entity';
import * as mongoose from 'mongoose';
import { QueryPaginateDto } from 'src/common/dto/paginate.dto';
import { FirebaseCloudMessageService, INotifyMessageBody } from 'src/firebase/firebase.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class NotificationsService {

  constructor(
    @InjectModel( NOTIFICATION_MODEL ) private readonly notyModel,
    private readonly fcmService: FirebaseCloudMessageService,
  ){}

  async create(createNotificationDto: CreateNotificationDto): Promise<NotificationEntityDocument> {
    const notify = new this.notyModel( createNotificationDto );
    return await notify.save();
  }

  async findById( id: string ): Promise<NotificationEntityDocument> {
    return await this.notyModel.findById(id);
  }

  async findOne( userId, notifyId ): Promise<any> {
    return await this.notyModel.findOne({
      user: userId,
      notifyId: notifyId
    }).exec();
  }

  async createMany(createNotificationDto: Array<CreateNotificationDto>): Promise<any> {
    return await this.notyModel.insertMany(createNotificationDto)
  }

  async getCountMessageUnread(userId: string): Promise<number> {
    return await this.notyModel.find({ isRead: false, user: userId }).count();
  }

  async updateReaded( filter: object ){
    return await this.notyModel.findOneAndUpdate( filter, { isRead: true } );
  }

  async findAll(id: string, query: QueryPaginateDto ): Promise<Array<NotificationEntityDocument>>  {

    const data = await this.notyModel.aggregate([
      { 
        $match: {
          isRead: false,
          user: mongoose.Types.ObjectId(id)
        }
      },
      { $sort: { "_id": -1 } },
      {
          $facet: {
              items: [{ $skip: Number(query.limit) * (Number(query.page) - 1) }, { $limit: Number(query.limit) }],
              total: [
                  {
                      $count: 'count'
                  }
              ]
          }
      }
    ]).exec();  

    return data[0];

  }

  async remove(id: string) {
    return await this.notyModel.findByIdAndDelete(id);
  }

  async clear( userId: string ){
    return await this.notyModel.delete({
      user: userId
    })
  }

  sendNotify( fcmUserToken: string[], notifyData: INotifyMessageBody , userId: string ){
    const notifyId = uuidv4();
    // create notify data
    this.create({
      ...notifyData,
      user: userId,
      notifyId: notifyId
    } as CreateNotificationDto )
    // send to fcm
    if(fcmUserToken.length > 0){
      this.fcmService.sendMessage( fcmUserToken, notifyData );
    }

  }
}
