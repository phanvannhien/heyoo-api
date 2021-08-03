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
import { v4 as uuidv4 } from 'uuid';
import { AdminJWTAuthGuard } from 'src/admin-users/admin-jwt-auth.guard';

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


    @Get()
    @ApiBearerAuth()
    @UseGuards( JwtAuthGuard )
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
    @UseGuards( JwtAuthGuard )
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
    @UseGuards( JwtAuthGuard )
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


    @Get('type/hot')
    @ApiBearerAuth()
    @UseGuards( JwtAuthGuard )
    @ApiOkResponse({
        type: VideosItemsResponse
    })
    async getHot(): Promise<IResponse>{
        const d = await this.videoService.getHot();
       
        return new ResponseSuccess(new VideosItemsResponse(d));
    }

    @Get(':id/relation')
    @ApiBearerAuth()
    @UseGuards( JwtAuthGuard )
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
