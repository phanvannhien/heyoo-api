import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, BadRequestException } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationEntityDocument } from './entities/notification.entity';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { NotificationPaginateResponse } from './responses/notification-paginate.response';
import { ResponseSuccess } from 'src/common/dto/response.dto';
import { IResponse } from 'src/common/interfaces/response.interface';
import { QueryPaginateDto } from 'src/common/dto/paginate.dto';
import { UsersService } from 'src/users/users.service';
import { FirebaseCloudMessageService, INotifyMessageBody } from 'src/firebase/firebase.service';
import { NotificationItemResponse } from './responses/notification.response';
import { UpdateReadNotificationDto } from './dto/update-read.dto';
import { AdminJWTAuthGuard } from 'src/admin-users/admin-jwt-auth.guard';
import { CreateNotificationTopicDto } from './dto/notification-topic.dto';
import { v4 as uuidv4 } from 'uuid';
import { FirebaseDBService } from 'src/firebase/firebase-db.service';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly userService: UsersService,
    private readonly fcmService: FirebaseCloudMessageService,
    private firebaseDBService: FirebaseDBService,
  ) {}

  @Post('set-read')
  @ApiOkResponse({
    type: NotificationItemResponse
  })
  @ApiBody({ type: UpdateReadNotificationDto })
  @ApiBearerAuth()
  @UseGuards( JwtAuthGuard )
  async updateIsRead(@Req() req, @Body() body: UpdateReadNotificationDto ): Promise<IResponse> {
    const noti = await this.notificationsService.findOne( req.user.id, body.notifyId );
    if(!noti) throw new BadRequestException( 'Notify not found' );
    await this.notificationsService.updateReaded({
      notifyId: body.notifyId,
      user: req.user.id
    });
    const data = await this.notificationsService.findById(noti.id)
    return new ResponseSuccess( new NotificationItemResponse(data) );
  }

  @Get()
  @ApiBearerAuth()
  @ApiResponse({
    type: NotificationPaginateResponse
  })
  @UseGuards( JwtAuthGuard )
  async findAll( @Req() req, @Query() query: QueryPaginateDto ): Promise<IResponse> {
    const data = await this.notificationsService.findAll( req.user.id, query );
    const countUnread = await this.notificationsService.getCountMessageUnread( req.user.id );
    return new ResponseSuccess( new NotificationPaginateResponse({
      ...data,
      countUnread: countUnread
    }))
  }


  @ApiBearerAuth()
  @UseGuards( JwtAuthGuard )
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.notificationsService.remove(id);
  }

  @ApiBearerAuth()
  @UseGuards( JwtAuthGuard )
  @Get('get-unread')
  async getUserUnreadNotification(@Req() req ): Promise<IResponse> {
    const data = await this.notificationsService.getCountMessageUnread(req.user.id);
    return new ResponseSuccess({
      unreadCount: data
    });
  }


  @ApiBearerAuth()
  @UseGuards( JwtAuthGuard )
  @Post('topic')
  async sendToTopic(@Req() req, @Body() body: CreateNotificationTopicDto ): Promise<IResponse> {
    const userSender = await this.userService.findById( body.uid );
    if (!userSender) throw new BadRequestException( 'Sender not found' );

    const allMembers = await this.firebaseDBService.getMemberIdsInChatRoom(body.chatRoomId);
    
    const notifyId = uuidv4();
    const title = userSender.fullname; 
    const avatar = userSender.avatar ?? 'https://d21y6rmzuyq1qt.cloudfront.net/27a2ff52-6ae1-49e3-bde6-6427b661588f'; 
    
    const notifyData = {
      title: title,
      body: body.body,
      imageUrl: avatar ,
      metaData: {
        sender: body.uid,
        senderAvatar: avatar,
        title: title,
        body: body.body,
        id: body.chatRoomId,
        status: 'done',
        clickAction: 'FLUTTER_NOTIFICATION_CLICK'
      },
      clickAction: 'FLUTTER_NOTIFICATION_CLICK'
    }

    // create user notify
    const notifyDataCreate =  allMembers.map( user => {
        return {
          ...notifyData,
          user: user.id ,
          notifyId: notifyId,
          isRead: false
        }
    })

    await this.notificationsService.createMany( notifyDataCreate as Array<CreateNotificationDto> )
    this.fcmService.sendTopicMessage( title, body.body, body.chatRoomId, avatar, body.uid );

    return new ResponseSuccess({
      message: 'OK'
    });

  }


}
