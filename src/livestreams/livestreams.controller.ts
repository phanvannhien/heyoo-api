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
const crypto = require('crypto');


@ApiTags('livestreams')
@Controller('livestreams')
export class LivestreamsController {
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


  @ApiBearerAuth()
  @ApiOkResponse({
    type: LiveStreamResponse
  })
  @ApiBody({
      type: CreateLivestreamDto,
      description: 'Start a livestream'
  })
  @ApiConsumes('multipart/form-data')
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('coverPicture'))
  async create(@Req() request, @Body() body: CreateLivestreamDto, @UploadedFile() coverPicture): Promise<IResponse> {


    let shop: ShopEntityDocument;
    let notifyData: INotifyMessageBody;

    const category = await this.categoryService.findOne( body.categories );
    if( !category ) throw new BadRequestException('Category not found');

    if( body.shop ){
      shop = await this.shopService.findById(body.shop);
      if( !shop ) throw new BadRequestException('Shop not found');
    }

    const coverPhoto = await this.fileService.uploadPublicFile(coverPicture.buffer, coverPicture.originalname);
    const uid = crypto.randomBytes(4).readUInt32BE(0, true);
    
    const channelName = uuidv4();
    const agoraToken = await this.agoraService.generateAgoraToken( channelName, uid  );
    const agoraRtmToken = await this.agoraService.generateAgoraRtmToken( uid.toString(), 1 );

    const createData = {
      channelName: channelName,
      coverPicture: coverPhoto,
      channelTitle: body.channelTitle,
      categories: body.categories,

      streamer: request.user.id,
      streamerUid: uid,
      shop: body.shop,
      agoraToken: agoraToken,
      agoraRtmToken: agoraRtmToken,
      liveMode: body.liveMode,
      donateUid: new Date().getTime()
    };
    
    const liveStream = await this.livestreamsService.create(createData);

    const notifyId = uuidv4();
    const metadataBody = {
      streamerId: request.user.id,
      streamerUid: liveStream.streamerUid,
      liveStreamId: liveStream.id,
      coverPicture: liveStream.coverPicture,
      channelName: liveStream.channelName,
      channelTitle: liveStream.channelTitle,
      agoraToken: liveStream.agoraToken,
      agoraRtmToken: liveStream.agoraRtmToken,
      notifyId: notifyId
    }

    // notify
    if( body.shop ){
      notifyData = {
        title: `${shop.shopName} is livestreaming now`,
        body: 'Watch it now!',
        imageUrl: shop.image,
        metaData: {
          shopId: shop.id,
          ...metadataBody
        },
        clickAction: 'JOIN_SHOP_LIVESTREAM'
      }
    }else{
    
      notifyData = {
        title: `${request.user.fullName} is livestreaming now`,
        body: 'Watch it now!',
        imageUrl: liveStream.streamer.avatar,
        metaData: metadataBody,
        clickAction: 'JOIN_SINGLE_LIVESTREAM'
      }

      // create wall if live mode is single
      await this.wallService.create({
        caption: liveStream.channelTitle,
        images: [
          liveStream.coverPicture
        ],
        postType: 'livestream',
        liveStreamId: liveStream.id,
        liveStreamStatus: true,
        user: request.user.id
      });

    }

    // get users and fcm tokens of follower current user
    const userFollowAndTokens = await this.userService.getUserFollowerFcmToken( request.user.id );


    // send notify to all follower user
    if( userFollowAndTokens.fcms.length>0){
      this.fcmService.sendMessage( userFollowAndTokens.fcms, notifyData );
    }

    // create notify data
    if( userFollowAndTokens.users.length>0){

      const notifyDataCreate =  userFollowAndTokens.users.map( userId => {
        return {
          ...notifyData,
          user: userId,
          notifyId: notifyId
        } as CreateNotificationDto
      })
      await this.notifyService.createMany( notifyDataCreate )

    }
   
    if( body.shop ){
      await this.livestreamsService.acquireRecordVideo( liveStream );
    }
   
    const responseObj = {
      stream: liveStream ,
      agoraToken: agoraToken,
      rtmToken: agoraRtmToken
    };

    return new ResponseSuccess(new LiveStreamResponse(responseObj));
  }


  @ApiOkResponse({
    description: 'Get status record livestream'
  })
  @Get(':id/record-video-status')
  async getRecordVideoStatus(@Param('id') id: string): Promise<IResponse> {
    const live = await this.livestreamsService.findOne(id);
    const data =  await this.livestreamsService.getRecordStatus( live );
    return new ResponseSuccess({ data: data }); 
  }

  @ApiOkResponse({
    description: 'Stop record livestream'
  })
  @Post(':id/stop-record-video')
  async stopRecordVideoStatus(@Param('id') id: string): Promise<IResponse> {
    const live = await this.livestreamsService.findOne(id);
    const data =  await this.livestreamsService.stopRecordVideo( live );
    return new ResponseSuccess({ data: data }); 
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'End a livestream'
  })
  @Post(':id/end')
  @UseGuards(JwtAuthGuard)
  async endLiveStream(@Param('id', new MongoIdValidationPipe() ) id: string, @Req() request): Promise<IResponse> {
    // end live
    const d = await this.livestreamsService.endLiveStream( id, request.user.id );
    // update status post wall
    await this.wallService.endWallLive( id );

    // stop record
    if( d.shop && d.shop != '' ){
      await this.livestreamsService.stopRecordVideo( d );
    }
    
    return new ResponseSuccess(new LiveStreamItemResponse( d ));
  }

  @Get('all')
  @ApiOkResponse({
    type: [LiveStreamPaginationResponse],
    description: 'Find all livestreams with pagination'
  })
  async findAllLive( @Query() query: GetLiveStreamDto ): Promise<IResponse>{
    const d = await this.livestreamsService.findPaginate(query);
    return new ResponseSuccess( new LiveStreamPaginationResponse(d[0]) );
  }


  @Get()
  @ApiOkResponse({
    type: [LiveStreamItemResponse],
    description: 'Find all livestreams'
  })
  async findAll(): Promise<IResponse>{
    const d = await this.livestreamsService.findAll();
    return new ResponseSuccess( d.map( i => new LiveStreamItemResponse(i) ) );
  }

  @ApiOkResponse({
    description: 'Get a livestream info success'
  })
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


  @ApiOkResponse({
    type: LiveMemerResponse,
    description: 'Member join to a livestream success'
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/duet/guest-join')
  async duetJoinLive( 
      @Param('id', new MongoIdValidationPipe() ) id: string,
      @Req() request
    ): Promise<IResponse>{
    const uid = crypto.randomBytes(4).readUInt32BE(0, true);
    const d = await this.livestreamsService.joinMember( id, request.user.id, uid );
    if( !d ) throw new BadRequestException('Livestream Not found');

    // update livestream
    const donateUid = new Date().getTime();
    await this.livestreamsService.update( id, {
      duetGuestId: request.user.id,
      duetGuestUid: uid,
      donateUid: donateUid
    });

    const newLiveStream = await this.livestreamsService.findOne(id);

    const responseObj = {
      stream: newLiveStream,
      agoraToken: await this.agoraService.generateAgoraToken( d.liveStream.channelName, uid ),
      rtmToken: await this.agoraService.generateAgoraRtmToken( uid.toString(), 1 ),
      joinInfo: d
    };

    return new ResponseSuccess(new LiveMemerResponse(responseObj));
  }


  @ApiOkResponse({
    type: LiveMemerResponse,
    description: 'Member join to a livestream success'
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/join')
  async joinLive( 
      @Param('id', new MongoIdValidationPipe() ) id: string,
      @Req() request
    ): Promise<IResponse>{
    const uid = crypto.randomBytes(4).readUInt32BE(0, true);
    const d = await this.livestreamsService.joinMember( id, request.user.id, uid );
    if( !d ) throw new BadRequestException('Livestream Not found');

    const responseObj = {
      stream: d.liveStream,
      agoraToken: await this.agoraService.generateAgoraToken( d.liveStream.channelName, uid ),
      rtmToken: await this.agoraService.generateAgoraRtmToken( uid.toString(), 2 ),
      joinInfo: d
    };

    return new ResponseSuccess(new LiveMemerResponse(responseObj));
  }


  @ApiOkResponse({
    type: LiveMemerLeaveResponse,
    description: 'Leaving a livestream'
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/leave')
  async leaveLive( @Param('id', new MongoIdValidationPipe() ) id: string, @Req() request ): Promise<IResponse>{
    const d = await this.livestreamsService.leaveMember( id, request.user.id );
    const responseObj = {
      stream: d.liveStream,
      joinInfo: d
    };
    return new ResponseSuccess( new LiveMemerLeaveResponse( responseObj ) );
  }



  // @Put(':id')
  // update(@Param('id') id: string, @Body() updateLivestreamDto: UpdateLivestreamDto) {
  //   return this.livestreamsService.update(+id, updateLivestreamDto);
  // }

  @Delete(':id')
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
  async deleteAll(): Promise<any>{
    return await this.livestreamsService.removeAll();
  }


  @ApiOkResponse({
    description: 'Get status record livestream individual'
  })
  @Get(':id/record-individual/video-status')
  async getVideoIndividualStatus(@Param('id') id: string): Promise<IResponse> {
    const live = await this.livestreamsService.findOne(id);
    const data =  await this.livestreamsService.getRecordIndividualStatus( live );
    return new ResponseSuccess({ data: data }); 
  }

  @ApiOkResponse({
    description: 'Stop record livestream individual'
  })
  @Post(':id/stop-record-individual-video')
  async stopRecordVideoIndividualStatus(@Param('id') id: string): Promise<IResponse> {
    const live = await this.livestreamsService.findOne(id);
    const data =  await this.livestreamsService.stopRecordIndividualVideo( live );
    return new ResponseSuccess({ data: data }); 
  }
  /**
   * FOR ADMIN API
   */

  @Get('admin/all')
  @ApiOkResponse({
    type: [LiveStreamPaginationResponse],
    description: 'Find all livestreams with pagination'
  })
  async findAllForAdmin( @Query() query: AdminGetLiveStreamDto ): Promise<IResponse>{
    const d = await this.livestreamsService.findAdminPaginate(query);
    return new ResponseSuccess( new LiveStreamPaginationResponse(d[0]) );
  }
 
  @ApiOkResponse()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('force-end-all-livestream')
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

  // duet
  @ApiOkResponse()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/duet/invite')
  async inviteDuet( 
      @Param('id', new MongoIdValidationPipe() ) id: string, 
      @Body() body: InviteDuetDto, 
      @Req() request 
    ): Promise<IResponse>{

    const liveStream = await this.livestreamsService.findOne(id);
    if( !liveStream ) throw new BadRequestException('Livestream Not found');

    const userGuest = await this.userService.findById( body.userIdGuest )
    if( !userGuest ) throw new BadRequestException('User guest Not found');

    if( userGuest.id == request.user.id )  throw new BadRequestException('User guest must be different user host');

    const notifyId = uuidv4();
    const metadataBody = {
      streamerId: liveStream.streamer.id,
      streamerUid: liveStream.streamerUid,
      liveStreamId: liveStream.id,
      coverPicture: liveStream.coverPicture,
      channelName: liveStream.channelName,
      channelTitle: liveStream.channelTitle,
      agoraToken: liveStream.agoraToken,
      agoraRtmToken: liveStream.agoraRtmToken,
      notifyId: notifyId
    }

    const notifyData = {
      title: `You got an invitation!`,
      body: 'You have received an invitation to livestream with host.',
      imageUrl: liveStream.streamer.avatar,
      metaData: metadataBody,
      clickAction: 'INVITE_DUET'
    } as INotifyMessageBody

    const fcmTokens: string[] = await this.userService.getUserFcmToken( body.userIdGuest );
    if(fcmTokens.length > 0){
      this.fcmService.sendMessage( fcmTokens, notifyData );
    }
    // create notify data
    await this.notifyService.create({
      ...notifyData,
      user: body.userIdGuest,
      notifyId: notifyId
    } as CreateNotificationDto )

    await this.duetService.create({
      liveStream: liveStream.id,
      hostUser: liveStream.streamer.id,
      guestUser: body.userIdGuest,
      status: 'INVITE_DUET',
      fcmTokens: fcmTokens
    })

    return new ResponseSuccess( notifyData );
  }


  @ApiOkResponse()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/duet/reject')
  async rejectDuet( 
      @Param('id', new MongoIdValidationPipe() ) id: string, 
      @Body() body: RejectIntiveDuetDto,
      @Req() request 
    ): Promise<IResponse>{
      
    const liveStream = await this.livestreamsService.findOne(id);
    if( !liveStream ) throw new BadRequestException('Livestream Not found');

    const userHost = await this.userService.findById( body.userIdHost )
    if( !userHost ) throw new BadRequestException('User host Not found');
    if( userHost.id == request.user.id )  throw new BadRequestException('User guest must be different user host');

    const guestUser = await this.userService.findById(request.user.id);
    const notifyId = uuidv4();
    const metadataBody = {
      streamerId: liveStream.streamer.id,
      streamerUid: liveStream.streamerUid,
      liveStreamId: liveStream.id,
      coverPicture: liveStream.coverPicture,
      channelName: liveStream.channelName,
      channelTitle: liveStream.channelTitle,
      agoraToken: liveStream.agoraToken,
      agoraRtmToken: liveStream.agoraRtmToken,
      notifyId: notifyId
    }
    const notifyData = {
      title: `Invitation Rejected`,
      body: 'The guest has rejected your invitation. Invite another guest.',
      imageUrl: guestUser.avatar,
      metaData: metadataBody,
      clickAction: 'REJECT_DUET'
    } as INotifyMessageBody

    const fcmTokens: string[] = await this.userService.getUserFcmToken( body.userIdHost );
    if(fcmTokens.length > 0){
      this.fcmService.sendMessage( fcmTokens, notifyData );
    }
    // create notify data
    await this.notifyService.create({
      ...notifyData,
      user: body.userIdHost,
      notifyId: notifyId
    } as CreateNotificationDto )

    await this.duetService.create({
      liveStream: liveStream.id,
      hostUser: body.userIdHost ,
      guestUser: request.user.id,
      status: 'REJECT_DUET',
      fcmTokens: fcmTokens
    })

    return new ResponseSuccess( notifyData );
  }



  @ApiOkResponse()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/duet/accepted')
  async acceptedDuet( 
      @Param('id', new MongoIdValidationPipe() ) id: string, 
      @Body() body: AcceptedIntiveDuetDto,
      @Req() request 
    ): Promise<IResponse>{
    // check livestream
    const liveStream = await this.livestreamsService.findOne(id);
    if( !liveStream ) throw new BadRequestException('Livestream Not found');

    // check user
    const userHost = await this.userService.findById( body.userIdHost )
    if( !userHost ) throw new BadRequestException('User host Not found');
    if( userHost.id == request.user.id )  throw new BadRequestException('User guest must be different user host');

    const guestUser = await this.userService.findById(request.user.id);

    const notifyId = uuidv4();
    const metadataBody = {
      streamerId: liveStream.streamer.id,
      streamerUid: liveStream.streamerUid,
      liveStreamId: liveStream.id,
      coverPicture: liveStream.coverPicture,
      channelName: liveStream.channelName,
      channelTitle: liveStream.channelTitle,
      agoraToken: liveStream.agoraToken,
      agoraRtmToken: liveStream.agoraRtmToken,
      liveMode: liveStream.liveMode,
      notifyId:notifyId
    }
    const notifyData = {
      title: `Invitation Accepted`,
      body: 'The '+guestUser.fullname+' has accepted your invitation.',
      imageUrl: guestUser.avatar,
      metaData: metadataBody,
      clickAction: 'ACCEPTED_DUET'
    } as INotifyMessageBody

    // const fcmTokens: string[] = await this.userService.getUserFcmToken( body.userIdHost );
    const fcmTokens: string[] = await this.userService.getManyUserFcmToken( [body.userIdHost, request.user.id] );

    if(fcmTokens.length > 0){
      this.fcmService.sendMessage( fcmTokens, notifyData );
    }
    // create notify data
    await this.notifyService.create({
      ...notifyData,
      user: body.userIdHost,
      notifyId:notifyId
    } as CreateNotificationDto )

    // save duet
    await this.duetService.create({
      liveStream: liveStream.id,
      hostUser: body.userIdHost ,
      guestUser: request.user.id,
      status: 'ACCEPTED_DUET',
      fcmTokens: fcmTokens
    })

    return new ResponseSuccess( notifyData );
  }


  @ApiOkResponse()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/duet/kick-off-guest')
  async kickOffGuest( 
      @Param('id', new MongoIdValidationPipe() ) id: string, 
      @Body() body: KickOffGuestDuetDto,
      @Req() request 
    ): Promise<IResponse>{
      
    const liveStream = await this.livestreamsService.findOne(id);
    if( !liveStream ) throw new BadRequestException('Livestream Not found');

    const userGuest = await this.userService.findById( body.userIdGuest )
    if( !userGuest ) throw new BadRequestException('User guest Not found');
    if( userGuest.id == request.user.id )  throw new BadRequestException('User guest must be different user host');
    const notifyId = uuidv4();
    const metadataBody = {
      streamerId: liveStream.streamer.id,
      streamerUid: liveStream.streamerUid,
      liveStreamId: liveStream.id,
      coverPicture: liveStream.coverPicture,
      channelName: liveStream.channelName,
      channelTitle: liveStream.channelTitle,
      agoraToken: liveStream.agoraToken,
      agoraRtmToken: liveStream.agoraRtmToken,
      notifyId: notifyId
    }
    const notifyData = {
      title: `You are kick off by ${liveStream.streamer.fullname}`,
      body: 'You be kick off livestream duet.',
      imageUrl: liveStream.streamer.avatar,
      metaData: metadataBody,
      clickAction: 'KICKOFF_DUET'
    } as INotifyMessageBody

    // notify to guest user
    const fcmTokens: string[] = await this.userService.getUserFcmToken( body.userIdGuest );
    if(fcmTokens.length > 0){
      this.fcmService.sendMessage( fcmTokens, notifyData );
    }
    // create notify data to guest user
    await this.notifyService.create({
      ...notifyData,
      user: body.userIdGuest,
      notifyId: notifyId
    } as CreateNotificationDto )

    await this.duetService.create({
      liveStream: liveStream.id,
      hostUser: liveStream.streamer.id,
      guestUser: body.userIdGuest ,
      status: 'KICKOFF_DUET',
      fcmTokens: fcmTokens
    });

    // reset livestream data
    await this.livestreamsService.resetDuetLiveStreamData( liveStream.id );

    return new ResponseSuccess( notifyData );
  }

  @ApiOkResponse()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/duet/leave-duet')
  async leaveDuet( 
      @Param('id', new MongoIdValidationPipe() ) id: string, 
      @Req() request 
    ): Promise<IResponse>{
      
    const liveStream = await this.livestreamsService.findOne(id);
    if( !liveStream ) throw new BadRequestException('Livestream Not found');

    const guestUser = await this.userService.findById(request.user.id);
    const notifyId = uuidv4();
    const metadataBody = {
      streamerId: liveStream.streamer.id,
      streamerUid: liveStream.streamerUid,
      liveStreamId: liveStream.id,
      coverPicture: liveStream.coverPicture,
      channelName: liveStream.channelName,
      channelTitle: liveStream.channelTitle,
      agoraToken: liveStream.agoraToken,
      agoraRtmToken: liveStream.agoraRtmToken,
      notifyId: notifyId
    }
    const notifyData = {
      title: `${guestUser.fullname} are leave duet`,
      body: '',
      imageUrl: guestUser.avatar,
      metaData: metadataBody,
      clickAction: 'LEAVE_DUET'
    } as INotifyMessageBody

    // notify to host user
    const fcmTokens: string[] = await this.userService.getUserFcmToken( liveStream.streamer.id.toString() );
    if(fcmTokens.length > 0){
      this.fcmService.sendMessage( fcmTokens, notifyData );
    }
    // create notify data to host user
    await this.notifyService.create({
      ...notifyData,
      user: liveStream.streamer.id.toString(),
      notifyId: notifyId
    } as CreateNotificationDto )

    await this.duetService.create({
      liveStream: liveStream.id,
      hostUser: liveStream.streamer.id.toString() ,
      guestUser: request.user.id ,
      status: 'LEAVE_DUET',
      fcmTokens: fcmTokens
    })

    // reset livestream data
    await this.livestreamsService.resetDuetLiveStreamData( liveStream.id );

    return new ResponseSuccess( notifyData );
  }


  @ApiOkResponse()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/donate')
  async donate( 
      @Param('id', new MongoIdValidationPipe() ) id: string, 
      @Body() body: DonateDto,
      @Req() request 
    ): Promise<IResponse>{
      
    const liveStream = await this.livestreamsService.findOne(id);
    if( !liveStream ) throw new BadRequestException('Livestream Not found');

    const productFind = await this.productService.findById(body.product);
    if(!productFind) throw new BadRequestException('Product not found');

    const toUser = await this.userService.findById(body.toUser);
    if(!toUser) throw new BadRequestException('User donate not found');


    const data = await this.walletService.create({
      user: request.user.id,
      toUser: body.toUser,
      product: productFind.id,
      price: productFind.price,
      quantity: body.quantity,
      total: productFind.price * body.quantity,
      liveStream: liveStream.id,
      donateUid: liveStream.donateUid
    })

    return new ResponseSuccess( new WalletItemResponse(data));
  }

  @ApiOkResponse({
    type: DonateUserResponse
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id/donate/:userId')
  async getDonate( 
    @Param('id', new MongoIdValidationPipe() ) id: string, 
    @Param('userId', new MongoIdValidationPipe() ) userId: string, 
    @Req() request 
  ): Promise<IResponse>{
    const liveStream = await this.livestreamsService.findOne(id);
    if( !liveStream ) throw new BadRequestException('Livestream Not found');

    const toUser = await this.userService.findById(userId);
    if(!toUser) throw new BadRequestException('User donate not found');

    const productDonate = await this.walletService.getUserProductLiveStreamDonate( liveStream, userId );

    // return new ResponseSuccess(productDonate);

    return new ResponseSuccess( new DonateUserResponse({
      user: toUser,
      ...productDonate
    }));
  }


}
