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


@ApiTags('news')
@Controller('news')
export class NewsController {

    constructor(
        private readonly newsService: NewsService,
        private readonly fileService: FilesService
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
        return new ResponseSuccess(new NewsItemResponse(data));
    }


    @Get()
    @ApiBearerAuth()
    @ApiOkResponse({
        type: NewsItemsResponse
    })
    async find( @Query() query: GetNewsDto ): Promise<IResponse>{
        const d = await this.newsService.findAll(query);
        return new ResponseSuccess(new NewsItemsResponse(d));
    }

    @ApiOkResponse({ type: NewsItemResponse  })
    @ApiBearerAuth()
    @Get(':id')
    async get(@Param('id', new MongoIdValidationPipe() ) id: string): Promise<IResponse>{
        const find = await this.newsService.findById(id);
        if( !find ) throw new BadRequestException('News not found');
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

        const data = await this.newsService.update( id,  body);
        return new ResponseSuccess(new NewsItemResponse(data));
    }

    @ApiBearerAuth()
    @Delete(':id')
    async remove(@Param('id', new MongoIdValidationPipe() ) id: string) {
      return await this.newsService.remove(id);
    }



}
