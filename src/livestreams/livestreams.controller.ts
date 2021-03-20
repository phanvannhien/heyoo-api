import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, UseInterceptors, Req, UploadedFile, BadRequestException, Query } from '@nestjs/common';
import { LivestreamsService } from './livestreams.service';
import { CreateLivestreamDto } from './dto/create-livestream.dto';
import { UpdateLivestreamDto } from './dto/update-livestream.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
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
const crypto = require('crypto');


@ApiTags('livestreams')
@Controller('livestreams')
export class LivestreamsController {
  constructor(
    private readonly livestreamsService: LivestreamsService,
    private readonly fileService: FilesService,
    private readonly agoraService: AgoraService
    ) {}


  @ApiBearerAuth()
  @ApiOkResponse({
    type: LiveStreamResponse
  })
  @ApiBody({
      type: CreateLivestreamDto
  })
  @ApiConsumes('multipart/form-data')
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('coverPicture'))
  async create(@Req() request, @Body() body: CreateLivestreamDto, @UploadedFile() coverPicture): Promise<IResponse> {
    const coverPhoto = await this.fileService.uploadPublicFile(coverPicture.buffer, coverPicture.originalname);
    const uid = crypto.randomBytes(4).readUInt32BE(0, true);
    const createData = {
      channelName: uuidv4(),
      coverPicture: coverPhoto,
      streamer: request.user.id,
      channelTitle: body.channelTitle,
      categories: body.categories,
      streamerUid: uid
    };
    const responseObj = {
      stream:  await this.livestreamsService.create(createData),
      agoraToken: await this.agoraService.generateAgoraToken( createData.channelName, uid  ),
      rtmToken: await this.agoraService.generateAgoraRtmToken( uid.toString() )
    };
    return new ResponseSuccess(new LiveStreamResponse(responseObj));
  }


  @ApiBearerAuth()
  @ApiOkResponse()
  @Post(':id/end')
  @UseGuards(JwtAuthGuard)
  async endLiveStream(@Param('id') id: string, @Req() request): Promise<IResponse> {
    const d = await this.livestreamsService.endLiveStream( id, request.user.id );
    return new ResponseSuccess(new LiveStreamItemResponse( d ));
  }

  @Get('all')
  @ApiOkResponse({
    type: [LiveStreamItemResponse]
  })
  async findAllLive( @Query() query: GetLiveStreamDto ): Promise<IResponse>{
    const d = await this.livestreamsService.findAllStatus(query);
    return new ResponseSuccess( d.map( i => new LiveStreamItemResponse(i) ) );
  }

  @Get()
  @ApiOkResponse({
    type: [LiveStreamItemResponse]
  })
  async findAll(): Promise<IResponse>{
    const d = await this.livestreamsService.findAll();
    return new ResponseSuccess( d.map( i => new LiveStreamItemResponse(i) ) );
  }

  @ApiOkResponse()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<IResponse> {
    const d = await this.livestreamsService.findOne(id)
    return new ResponseSuccess( new LiveStreamItemResponse( d ) ) ;
  }


  @ApiOkResponse({
    type: LiveMemerResponse
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
      rtmToken: await this.agoraService.generateAgoraRtmToken( uid.toString() ),
      joinInfo: d
    };
    return new ResponseSuccess(new LiveMemerResponse(responseObj));
  }

  @ApiOkResponse({
    type: LiveMemerLeaveResponse
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
  async remove(@Param('id') liveStreamId: string): Promise<any>{
    return await this.livestreamsService.remove(liveStreamId);
  }

  @Delete()
  @ApiOkResponse()
  async deleteAll(): Promise<any>{
    return await this.livestreamsService.removeAll();
  }

}
