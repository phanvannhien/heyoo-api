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

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly userService: UsersService,
    private readonly fcmService: FirebaseCloudMessageService,
  ) {}

  @Post()
  @ApiOkResponse()
  @ApiBody({ type: CreateNotificationDto })
  @ApiBearerAuth()
  @UseGuards( JwtAuthGuard )
  async create( @Body() createNotificationDto: CreateNotificationDto): Promise<NotificationEntityDocument> {
    const user = await this.userService.findById(createNotificationDto.user);
    if(!user) throw new BadRequestException( 'User not found' );
    return await this.notificationsService.create(createNotificationDto);
  }

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


  @Post('do/:userId/send-test-user-notify')
  @ApiOkResponse()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async sendTestUserNotify(  @Param('userId') userId: string ): Promise<any>{
    const userTokens = await this.userService.getUserFcmToken( userId );
  
    const notifyData = {
      title: `You got an invitation!`,
      body: 'You have received an invitation to livestream with host.',
      imageUrl: 'https://d21y6rmzuyq1qt.cloudfront.net/27a2ff52-6ae1-49e3-bde6-6427b661588f',
      metaData: {
        testBodyDataKey: 'testBodyDataValue'
      },
      clickAction: 'CLICK_ACTION_DEMO'
    } as INotifyMessageBody

    if(userTokens.length > 0){
      return this.fcmService.sendMessage( userTokens, notifyData );
    }

    return;

  }
}
