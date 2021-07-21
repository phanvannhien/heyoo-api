import { Controller, Post, UseInterceptors, Req, Body, UploadedFile, Get, Query, Put, Param, BadRequestException, UsePipes, UseGuards, UploadedFiles, Res, Delete } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiBody, ApiConsumes, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { VideosService } from './videos.service';
import { VideosItemResponse } from './responses/videos.response';
import { CreateVideosDto } from './dto/create-videos.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { IResponse } from 'src/common/interfaces/response.interface';
import { ResponseSuccess } from 'src/common/dto/response.dto';
import { GetVideosDto } from './dto/get-videos.dto';
import { VideosItemsResponse } from './responses/videos-paginate.response';
import { UpdateVideosDto } from './dto/update-videos.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FilesService } from 'src/files/files.service';
import { MongoIdValidationPipe } from 'src/common/pipes/parse-mongo-id';
import { VideosEntityDocument } from './entities/videos.entity';
import { VideosItemsPaginateResponse } from './responses/videos-items-paginate.response';
import { QueryPaginateDto } from 'src/common/dto/paginate.dto';
import { VideoCategoriesService } from 'src/video-categories/video-categories.service';
import { UsersService } from 'src/users/users.service';
import { FirebaseCloudMessageService } from 'src/firebase/firebase.service';
import { CreateNotificationDto } from 'src/notifications/dto/create-notification.dto';
import { NotificationsService } from 'src/notifications/notifications.service';

@ApiTags('videos')
@Controller('videos')
export class VideosController {

    constructor(
        private readonly videoService: VideosService,
        private readonly fileService: FilesService,
        private readonly videCategryService: VideoCategoriesService,
        private readonly userService: UsersService,
        private readonly fcmService: FirebaseCloudMessageService,
        private readonly notifyService: NotificationsService,
    ) {}

    @ApiOkResponse({ type: VideosItemResponse })
    @ApiBody({ type: CreateVideosDto })
    @ApiBearerAuth()
    @UseGuards( JwtAuthGuard )
    @Post()
    async create( 
        @Req() req, 
        @Body() body: CreateVideosDto,
    ): Promise<IResponse>
    {

        const video = await this.videCategryService.findOne( body.category );
        if(!video) throw new BadRequestException('Category not found');

        const createData = { 
            ...body,
            createdBy: req.user.id,
        };
        
        const data = await this.videoService.create(createData);

        const notifyData = {
            title: `New Video`,
            body: data.title,
            imageUrl: data.image,
            metaData: {
              videoId: data.id
            },
            clickAction: 'VIEW_VIDEOS'
        }

        // create user notify
        const allUser = await this.userService.getAllUserActive();
        const notifyDataCreate =  allUser.map( i => {
           return {
            ...notifyData,
            user: i
           }
        })
        await this.notifyService.createMany( notifyDataCreate as Array<CreateNotificationDto> )

        // send notify
        const fcmTokens: string[] = await this.userService.getAllUserFcmtokens();
        if(fcmTokens.length>0){
          this.fcmService.sendMessage( fcmTokens, notifyData );
        }

        
        return new ResponseSuccess(new VideosItemResponse(data));
    }

    @Get('admin/get')
    @ApiBearerAuth()
    @ApiOkResponse({
        type: VideosItemsPaginateResponse
    })
    async getForAdmin( @Query() query: GetVideosDto ): Promise<IResponse>{
        const d = await this.videoService.getForAdmin(query);
        return new ResponseSuccess(new VideosItemsPaginateResponse(d[0] ));
    }

    @Get()
    @ApiBearerAuth()
    @ApiOkResponse({
        type: VideosItemsPaginateResponse
    })
    async find( @Query() query: GetVideosDto ): Promise<IResponse>{
        const d = await this.videoService.findAll(query);
        return new ResponseSuccess(new VideosItemsPaginateResponse(d[0] ));
    }

    @ApiOkResponse({ type: VideosItemResponse  })
    @ApiBearerAuth()
    @Get(':id')
    async get(@Param('id', new MongoIdValidationPipe() ) id: string): Promise<IResponse>{
        const find: VideosEntityDocument = await this.videoService.findById(id);
        if( !find ) throw new BadRequestException('videos not found');
        const updateView = {
            viewCount: find.viewCount + 1
        }
        await this.videoService.update( id, updateView );
        return new ResponseSuccess(new VideosItemResponse(find));
    }

    @ApiOkResponse({ type: VideosItemResponse  })
    @ApiBearerAuth()
    @Post(':id/share-count')
    async postShare(@Param('id', new MongoIdValidationPipe() ) id: string): Promise<IResponse>{
        const find: VideosEntityDocument = await this.videoService.findById(id);
        if( !find ) throw new BadRequestException('News not found');
        // update share count
        const update = {
            shareCount: find.shareCount + 1
        }
        await this.videoService.update( id, update );
        return new ResponseSuccess(new VideosItemResponse(find));
    }

    @ApiOkResponse({ type: VideosItemResponse })
    @ApiBody({ type: UpdateVideosDto })
    @ApiBearerAuth()
    @Put(':id')
    async update(
            @Param('id', new MongoIdValidationPipe() ) id: string,
            @Body() body: UpdateVideosDto
        ): Promise<IResponse> {
        const find = await this.videoService.findById(id);
        if( !find ) throw new BadRequestException('videos not found');
        const data = await this.videoService.update( id,  body);
        return new ResponseSuccess(new VideosItemResponse(data));
    }

    @ApiOkResponse({ type: VideosItemResponse })
    @ApiBearerAuth()
    @Put(':id/set-hot')
    async setHot(
            @Param('id', new MongoIdValidationPipe() ) id: string
        ): Promise<IResponse> {
        const find = await this.videoService.findById(id);
        if( !find ) throw new BadRequestException('videos not found');
        
        const data = await this.videoService.updateHot( find );
        return new ResponseSuccess(new VideosItemResponse(data));
    }

    @ApiBearerAuth()
    @Delete(':id')
    async remove(@Param('id', new MongoIdValidationPipe() ) id: string) {
      return await this.videoService.remove(id);
    }


    @Get('type/hot')
    @ApiBearerAuth()
    @ApiOkResponse({
        type: VideosItemsResponse
    })
    async getHot(): Promise<IResponse>{
        const d = await this.videoService.getHot();
       
        return new ResponseSuccess(new VideosItemsResponse(d));
    }

    @Get(':id/relation')
    @ApiBearerAuth()
    @ApiOkResponse({
        type: VideosItemsResponse
    })
    async relation( @Param('id', new MongoIdValidationPipe() ) id: string, @Query() paginate: QueryPaginateDto ): Promise<IResponse>{
        const find: VideosEntityDocument = await this.videoService.findById(id);
        if( !find ) throw new BadRequestException('Video not found');

        const d = await this.videoService.relation(find, paginate);
        return new ResponseSuccess(new VideosItemsResponse(d));
    }

}
