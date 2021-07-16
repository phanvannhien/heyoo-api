import { Controller, Post, UseInterceptors, Req, Body, UploadedFile, Get, Query, Put, Param, BadRequestException, UsePipes, UseGuards, UploadedFiles, Res, Delete } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiBody, ApiConsumes, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { NewsService } from './news.service';
import { NewsItemResponse } from './responses/news.response';
import { CreateNewsDto } from './dto/create-news.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { IResponse } from 'src/common/interfaces/response.interface';
import { ResponseSuccess } from 'src/common/dto/response.dto';
import { GetNewsDto } from './dto/get-news.dto';
import { NewsItemsResponse } from './responses/news-paginate.response';
import { UpdateNewsDto } from './dto/update-news.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FilesService } from 'src/files/files.service';
import { MongoIdValidationPipe } from 'src/common/pipes/parse-mongo-id';
import { CategoriesService } from 'src/categories/categories.service';
import { NewsCategoriesService } from 'src/news-categories/news-categories.service';
import { NewsEntityDocument } from './entities/news.entity';
import { NewsListItemsResponse } from './responses/news-items.response';
import { QueryPaginateDto } from 'src/common/dto/paginate.dto';
import { GetForAdminDto } from './dto/get-for-admin.dto';
import { UsersService } from 'src/users/users.service';
import { FirebaseCloudMessageService } from 'src/firebase/firebase.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { CreateNotificationDto } from 'src/notifications/dto/create-notification.dto';


@ApiTags('news')
@Controller('news')
export class NewsController {

    constructor(
        private readonly newsService: NewsService,
        private readonly fileService: FilesService,
        private readonly userService: UsersService,
        private readonly fcmService: FirebaseCloudMessageService,
        private readonly notifyService: NotificationsService,
    ) {}

    @ApiOkResponse({ type: NewsItemResponse })
    @ApiBody({ type: CreateNewsDto })
    @ApiBearerAuth()
    @UseGuards( JwtAuthGuard )
    @Post()
    async create( 
        @Req() req, 
        @Body() body: CreateNewsDto) : Promise<IResponse>
    {
       
        const createData = { 
            ...body,
            createdBy: req.user.id,
        };
        
        const data = await this.newsService.create(createData);

        const notifyData = {
            title: `New Post`,
            body: data.title,
            imageUrl: data.image,
            metaData: {
              newsId: data.id
            },
            clickAction: 'VIEW_NEWS'
        }
        const fcmTokens: string[] = await this.userService.getAllUserFcmtokens();
        if(fcmTokens.length>0){
          this.fcmService.sendMessage( fcmTokens, notifyData );
        }

        const allUser = await this.userService.getAllUserActive();
        const notifyDataCreate =  allUser.map( i => {
           return {
            ...notifyData,
            user: i
           }
        })
        
        await this.notifyService.createMany( notifyDataCreate as Array<CreateNotificationDto> )
    
        return new ResponseSuccess(new NewsItemResponse(data));
    }


    @Get()
    @ApiBearerAuth()
    @ApiOkResponse({
        type: NewsItemsResponse
    })
    async find( @Query() query: GetNewsDto ): Promise<IResponse>{
        const d = await this.newsService.findAll(query);
        return new ResponseSuccess(new NewsItemsResponse(d[0] ));
    }

    @Get('type/hot')
    @ApiBearerAuth()
    @ApiOkResponse({
        type: NewsListItemsResponse
    })
    async getHotNews(): Promise<IResponse>{
        const d = await this.newsService.getHotNews();
        return new ResponseSuccess(new NewsListItemsResponse(d));
    }

    @Get(':id/relation')
    @ApiBearerAuth()
    @ApiOkResponse({
        type: NewsListItemsResponse
    })
    async relation( @Param('id', new MongoIdValidationPipe() ) id: string, @Query() paginate: QueryPaginateDto ): Promise<IResponse>{
        const find: NewsEntityDocument = await this.newsService.findById(id);
        if( !find ) throw new BadRequestException('News not found');

        const d = await this.newsService.relation(find, paginate);
        return new ResponseSuccess(new NewsListItemsResponse(d));
    }

    @ApiOkResponse({ type: NewsItemResponse  })
    @ApiBearerAuth()
    @Get(':id')
    async get(@Param('id', new MongoIdValidationPipe() ) id: string): Promise<IResponse>{
        const find: NewsEntityDocument = await this.newsService.findById(id);
        if( !find ) throw new BadRequestException('News not found');
        // update count view
        const updateView = {
            viewCount: find.viewCount + 1
        }
        await this.newsService.update( id, updateView );
    
        return new ResponseSuccess(new NewsItemResponse(find));
    }

   


    @ApiOkResponse({ type: NewsItemResponse  })
    @ApiBearerAuth()
    @Post(':id/share-count')
    async postShare(@Param('id', new MongoIdValidationPipe() ) id: string): Promise<IResponse>{
        const find: NewsEntityDocument = await this.newsService.findById(id);
        if( !find ) throw new BadRequestException('News not found');
        // update share count
        const update = {
            shareCount: find.shareCount + 1
        }
        await this.newsService.update( id, update );
        return new ResponseSuccess(new NewsItemResponse(find));
    }

    @ApiOkResponse({ type: NewsItemResponse })
    @ApiBody({ type: UpdateNewsDto })
    @ApiBearerAuth()
    @Put(':id')
    async update(
            @Param('id', new MongoIdValidationPipe() ) id: string,
            @Body() body: UpdateNewsDto
        ): Promise<IResponse> {
        const find = await this.newsService.findById(id);
        if( !find ) throw new BadRequestException('News not found');
        delete body['createdAt'];
        const data = await this.newsService.update( id,  body);
        return new ResponseSuccess(new NewsItemResponse(data));
    }

    @ApiBearerAuth()
    @Delete(':id')
    async remove(@Param('id', new MongoIdValidationPipe() ) id: string) {
      return await this.newsService.remove(id);
    }


    @Get('admin/get')
    @ApiBearerAuth()
    @ApiOkResponse({
        type: NewsItemsResponse
    })
    async getForAdmin( @Query() query: GetForAdminDto ): Promise<IResponse>{
        const d = await this.newsService.getForAdmin(query);
        return new ResponseSuccess(new NewsItemsResponse(d[0] ));
    }


    @ApiOkResponse({ type: NewsItemResponse })
    @ApiBearerAuth()
    @Put(':id/set-hot')
    async setHot(
            @Param('id', new MongoIdValidationPipe() ) id: string
        ): Promise<IResponse> {
        const find = await this.newsService.findById(id);
        if( !find ) throw new BadRequestException('News not found');
        
        const data = await this.newsService.updateHot( find );
        return new ResponseSuccess(new NewsItemResponse(data));
    }


}
