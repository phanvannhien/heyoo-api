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

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly userService: UsersService,
    private readonly fcmService: FirebaseCloudMessageService,
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

}
