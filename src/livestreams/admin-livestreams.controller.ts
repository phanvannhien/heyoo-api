import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, UseInterceptors, Req, UploadedFile, BadRequestException, Query } from '@nestjs/common';
import { LivestreamsService } from './livestreams.service';
import { CreateLivestreamDto } from './dto/create-livestream.dto';
import { UpdateLivestreamDto } from './dto/update-livestream.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiProperty, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { IResponse } from 'src/common/interfaces/response.interface';
import { ResponseSuccess } from 'src/common/dto/response.dto';
import { LiveStreamResponse } from './responses/livestream.response';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from 'src/files/files.service';
import { AgoraService } from 'src/agora/agora.service';
import { CreateTokenDto } from './dto/create-token.dto';
import { v4 as uuidv4 } from 'uuid';
import { LiveStreamItemResponse } from './responses/live-item.response';
import { LiveMemerResponse } from './responses/live-member.response';
import { LiveMemerLeaveResponse } from './responses/live-member-leave.response';
import { GetLiveStreamDto } from './dto/get-livestream.dto';
import { UserWallsService } from 'src/user-walls/user-walls.service';
import { LiveStreamPaginationResponse } from './responses/livestream-pagination.response';
import { CategoriesService } from 'src/categories/categories.service';
import { ShopService } from 'src/shop/shop.service';
import { FirebaseCloudMessageService, INotifyMessageBody } from 'src/firebase/firebase.service';
import { ShopEntityDocument } from 'src/shop/entities/shop.entity';
import { UsersService } from 'src/users/users.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { CreateNotificationDto } from 'src/notifications/dto/create-notification.dto';
import { AdminGetLiveStreamDto } from './dto/admin-get-livestream.dto';
import { MongoIdValidationPipe } from 'src/common/pipes/parse-mongo-id';
import { InviteDuetDto } from './dto/invite-duet.dto';
import { RejectIntiveDuetDto } from './dto/reject-duet.dto';
import { AcceptedIntiveDuetDto } from './dto/accept-duet.dto';
import { KickOffGuestDuetDto } from './dto/kick-off-duet.dto';
import { LeaveDuetDto } from './dto/leave-duet.dto';
import { DuetService } from './duet.service';
import { WalletsService } from 'src/wallets/wallets.service';
import { DonateDto } from './dto/donate.dto';
import { ProductsService } from 'src/products/products.service';
import { DonateUserResponse } from './responses/donate-user.response';
import { WalletItemResponse } from 'src/wallets/responses/wallet.response';
import { AdminJWTAuthGuard } from 'src/admin-users/admin-jwt-auth.guard';
const crypto = require('crypto');


@ApiTags('admin')
@Controller('admin-livestreams')
export class AdminLivestreamsController {
  constructor(
    private readonly livestreamsService: LivestreamsService,
    private readonly fileService: FilesService,
    private readonly agoraService: AgoraService,
    private readonly wallService: UserWallsService,
    private readonly categoryService: CategoriesService,
    private readonly shopService: ShopService,
    private readonly fcmService: FirebaseCloudMessageService,
    private readonly userService: UsersService,
    private readonly notifyService: NotificationsService,
    private readonly duetService: DuetService,
    private readonly walletService: WalletsService,
    private readonly productService: ProductsService,
    ) {}


  @ApiOkResponse({
    description: 'Get status record livestream'
  })
  @Get(':id/record-video-status')
  @ApiBearerAuth()
  @UseGuards(AdminJWTAuthGuard)
  async getRecordVideoStatus(@Param('id') id: string): Promise<IResponse> {
    const live = await this.livestreamsService.findOne(id);
    const data =  await this.livestreamsService.getRecordStatus( live );
    return new ResponseSuccess({ data: data }); 
  }

  @ApiOkResponse({
    description: 'Stop record livestream'
  })
  @Post(':id/stop-record-video')
  @ApiBearerAuth()
  @UseGuards(AdminJWTAuthGuard)
  async stopRecordVideoStatus(@Param('id') id: string): Promise<IResponse> {
    const live = await this.livestreamsService.findOne(id);
    const data =  await this.livestreamsService.stopRecordVideo( live );
    return new ResponseSuccess({ data: data }); 
  }


  @Get('all')
  @ApiOkResponse({
    type: [LiveStreamPaginationResponse],
    description: 'Find all livestreams with pagination'
  })
  @ApiBearerAuth()
  @UseGuards(AdminJWTAuthGuard)
  async findAllLive( @Query() query: GetLiveStreamDto ): Promise<IResponse>{
    const d = await this.livestreamsService.findPaginate(query);
    return new ResponseSuccess( new LiveStreamPaginationResponse(d[0]) );
  }

  @Get()
  @ApiOkResponse({
    type: [LiveStreamItemResponse],
    description: 'Find all livestreams'
  })
  @ApiBearerAuth()
  @UseGuards(AdminJWTAuthGuard)
  async findAll(): Promise<IResponse>{
    const d = await this.livestreamsService.findAll();
    return new ResponseSuccess( d.map( i => new LiveStreamItemResponse(i) ) );
  }

  @ApiOkResponse({
    description: 'Get a livestream info success'
  })
  @ApiBearerAuth()
  @UseGuards(AdminJWTAuthGuard)
  @Get(':id')
  async findOne( @Param('id', new MongoIdValidationPipe() ) id: string): Promise<IResponse> {
    const d = await this.livestreamsService.findOne(id);
    if( !d ) throw new BadRequestException('Not found');
    // update count view
    const updateView = {
      viewCount: d.viewCount + 1
    }
    await this.livestreamsService.update( id, updateView );

    return new ResponseSuccess( new LiveStreamItemResponse( d ) ) ;
  }


  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AdminJWTAuthGuard)
  @ApiOkResponse({
    description: 'Deleted a livestream'
  })
  async remove(@Param('id', new MongoIdValidationPipe() ) liveStreamId: string): Promise<any>{
    return await this.livestreamsService.remove(liveStreamId);
  }

  @Delete()
  @ApiOkResponse({
    description: 'Deleted all livestreams'
  })
  @ApiBearerAuth()
  @UseGuards(AdminJWTAuthGuard)
  async deleteAll(): Promise<any>{
    return await this.livestreamsService.removeAll();
  }


  @ApiOkResponse({
    description: 'Get status record livestream individual'
  })
  @Get(':id/record-individual/video-status')
  @ApiBearerAuth()
  @UseGuards(AdminJWTAuthGuard)
  async getVideoIndividualStatus(@Param('id') id: string): Promise<IResponse> {
    const live = await this.livestreamsService.findOne(id);
    const data =  await this.livestreamsService.getRecordIndividualStatus( live );
    return new ResponseSuccess({ data: data }); 
  }

  @ApiOkResponse({
    description: 'Stop record livestream individual'
  })
  @Post(':id/stop-record-individual-video')
  @ApiBearerAuth()
  @UseGuards(AdminJWTAuthGuard)
  async stopRecordVideoIndividualStatus(@Param('id') id: string): Promise<IResponse> {
    const live = await this.livestreamsService.findOne(id);
    const data =  await this.livestreamsService.stopRecordIndividualVideo( live );
    return new ResponseSuccess({ data: data }); 
  }


  @Get('admin/all')
  @ApiOkResponse({
    type: [LiveStreamPaginationResponse],
    description: 'Find all livestreams with pagination'
  })
  @ApiBearerAuth()
  @UseGuards(AdminJWTAuthGuard)
  async findAllForAdmin( @Query() query: AdminGetLiveStreamDto ): Promise<IResponse>{
    const d = await this.livestreamsService.findAdminPaginate(query);
    return new ResponseSuccess( new LiveStreamPaginationResponse(d[0]) );
  }
 
  @ApiOkResponse()
  @UseGuards(AdminJWTAuthGuard)
  @ApiBearerAuth()
  @Post('force-end-all-livestream')
  @UseGuards(AdminJWTAuthGuard)
  async userForceEndAllLivestream( @Req() request ): Promise<IResponse>{
    const user = await this.userService.findById(request.user.id);
    if( !user ) throw new BadRequestException('User not found');
    const allLive = await this.livestreamsService.forceEndUserLiveStream(user);
    return new ResponseSuccess( { success: true } );

  }
  @Put(':id/admin/force-end')
  async forceEndLiveStream( @Param('id', new MongoIdValidationPipe() ) id: string ): Promise<IResponse>{

    const d = await this.livestreamsService.findOne(id);
    if( !d ) throw new BadRequestException('Not found');

    // update status post wall
    await this.wallService.endWallLive( id );

    // stop record
    if( d.shop && d.shop != '' ){
      await this.livestreamsService.stopRecordVideo( d );
    }

    const data = await this.livestreamsService.forceEndLiveStream(id);
    const notifyId = uuidv4();
    // notify force end
    const metadataBody = {
      streamerId: d.streamer.id,
      streamerUid: d.streamerUid,
      liveStreamId: d.id,
      coverPicture: d.coverPicture,
      channelName: d.channelName,
      channelTitle: d.channelTitle,
      agoraToken: d.agoraToken,
      agoraRtmToken: d.agoraRtmToken,
      notifyId: notifyId
    }


    const notifyData = {
      title: `Your livestream has been force end`,
      body: 'Admin has been force end your livestream ',
      imageUrl: d.streamer.avatar,
      metaData: metadataBody,
      clickAction: 'FORCE_END_LIVESTREAM'
    } as INotifyMessageBody

    // notify to user
    const fcmTokens: string[] = await this.userService.getUserFcmToken( d.streamer.id.toString() );
    if(fcmTokens.length > 0){
      this.fcmService.sendMessage( fcmTokens, notifyData );
    }
    // create notify data to host user
    await this.notifyService.create({
      ...notifyData,
      user: d.streamer.id.toString(),
      notifyId: notifyId
    } as CreateNotificationDto )

    return new ResponseSuccess( data );
  }



}
