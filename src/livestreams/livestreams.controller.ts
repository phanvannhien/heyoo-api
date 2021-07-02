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

    const category = await this.categoryService.findOne( body.categories );
    if( !category ) throw new BadRequestException('Category not found');

    if( body.shop ){
      const shop = await this.shopService.findById(body.shop);
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

    };
    const liveStream = await this.livestreamsService.create(createData);

    if( body.shop ){
      await this.livestreamsService.acquireRecordVideo( liveStream );
    }
   
    // create wall post
    if( !body.shop && body.shop == '' ){
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
  async endLiveStream(@Param('id') id: string, @Req() request): Promise<IResponse> {
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
  async findOne(@Param('id') id: string): Promise<IResponse> {
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
  @Post(':id/join')
  async joinLive(@Param('id') id: string, @Req() request ): Promise<IResponse>{
    const uid = crypto.randomBytes(4).readUInt32BE(0, true);
    const d = await this.livestreamsService.joinMember( id, request.user.id, uid );
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
  async leaveLive(@Param('id') id: string, @Req() request ): Promise<IResponse>{
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
  async remove(@Param('id') liveStreamId: string): Promise<any>{
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

}
