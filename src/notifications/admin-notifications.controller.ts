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

@ApiTags('admin')
@Controller('admin-notifications')
export class AdminNotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly userService: UsersService,
    private readonly fcmService: FirebaseCloudMessageService,
  ) {}

  @Post()
  @ApiOkResponse()
  @ApiBody({ type: CreateNotificationDto })
  @ApiBearerAuth()
  @UseGuards( AdminJWTAuthGuard )
  async create( @Body() createNotificationDto: CreateNotificationDto): Promise<NotificationEntityDocument> {
    const user = await this.userService.findById(createNotificationDto.user);
    if(!user) throw new BadRequestException( 'User not found' );
    return await this.notificationsService.create(createNotificationDto);
  }


  @Post('do/:userId/send-test-user-notify')
  @ApiOkResponse()
  @ApiBearerAuth()
  @UseGuards(AdminJWTAuthGuard)
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
