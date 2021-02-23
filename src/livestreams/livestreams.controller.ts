import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, UseInterceptors, Req, UploadedFile } from '@nestjs/common';
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


@ApiTags('livestreams')
@Controller('livestreams')
export class LivestreamsController {
  constructor(
    private readonly livestreamsService: LivestreamsService,
    private readonly fileService: FilesService,
    private readonly agoraService: AgoraService
    ) {}


  @ApiBearerAuth()
  @ApiOkResponse()
  @ApiBody({
      type: CreateLivestreamDto
  })
  @ApiConsumes('multipart/form-data')
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('coverPicture'))
  async create(@Req() request, @Body() body: CreateLivestreamDto, @UploadedFile() coverPicture): Promise<IResponse> {
    const coverPhoto = await this.fileService.uploadPublicFile(coverPicture.buffer, coverPicture.originalname);
    body.coverPicture = coverPhoto;
    body.streamer = request.user.id;
    const d = await this.livestreamsService.create(body);
    return new ResponseSuccess(new LiveStreamResponse(d));
  }


  // @Get()
  // findAll() {
  //   return this.livestreamsService.findAll();
  // }

  @ApiOkResponse()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<IResponse> {
    const d = await this.livestreamsService.findOne(id)
    return new ResponseSuccess( new LiveStreamResponse( d ) ) ;
  }

  @ApiBearerAuth()
  @ApiOkResponse()
  @UseGuards(JwtAuthGuard)
  @Post('token')
  async getToken(@Req() req, @Body() body: CreateTokenDto ): Promise<IResponse> {
    const d = this.agoraService.generateAgoraToken( body.channelName, req.user.id );
    return new ResponseSuccess( {
      token: d
    }) ;
  }



  // @Put(':id')
  // update(@Param('id') id: string, @Body() updateLivestreamDto: UpdateLivestreamDto) {
  //   return this.livestreamsService.update(+id, updateLivestreamDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.livestreamsService.remove(+id);
  // }
}
