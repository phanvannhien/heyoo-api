import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationEntityDocument } from './entities/notification.entity';
import { ApiBearerAuth, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiOkResponse()
  @ApiBody({ type: CreateNotificationDto })
  @ApiBearerAuth()
  @UseGuards( JwtAuthGuard )
  async create(@Body() createNotificationDto: CreateNotificationDto): Promise<NotificationEntityDocument> {
    return await this.notificationsService.create(createNotificationDto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards( JwtAuthGuard )
  async findAll( @Req() req ): Promise<Array<NotificationEntityDocument>> {
    return this.notificationsService.findAll( req.user.id );
  }

  @ApiBearerAuth()
  @UseGuards( JwtAuthGuard )
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.notificationsService.remove(id);
  }
}
