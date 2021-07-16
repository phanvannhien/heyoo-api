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

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly userService: UsersService,
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

  @Get()
  @ApiBearerAuth()
  @ApiResponse({
    type: NotificationPaginateResponse
  })
  @UseGuards( JwtAuthGuard )
  async findAll( @Req() req, @Query() query: QueryPaginateDto ): Promise<IResponse> {
    const data = await this.notificationsService.findAll( req.user.id, query );
    return new ResponseSuccess( new NotificationPaginateResponse(data[0]) )
  }

  @ApiBearerAuth()
  @UseGuards( JwtAuthGuard )
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.notificationsService.remove(id);
  }
}
