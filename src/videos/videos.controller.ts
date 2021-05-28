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

@ApiTags('videos')
@Controller('videos')
export class VideosController {

    constructor(
        private readonly newsService: VideosService,
        private readonly fileService: FilesService
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
        const createData = { 
            ...body,
            createdBy: req.user.id,
        };
        
        const data = await this.newsService.create(createData);
        return new ResponseSuccess(new VideosItemResponse(data));
    }


    @Get()
    @ApiBearerAuth()
    @ApiOkResponse({
        type: VideosItemsResponse
    })
    async find( @Query() query: GetVideosDto ): Promise<IResponse>{
        const d = await this.newsService.findAll(query);
        return new ResponseSuccess(new VideosItemsResponse(d));
    }

    @ApiOkResponse({ type: VideosItemResponse  })
    @ApiBearerAuth()
    @Get(':id')
    async get(@Param('id', new MongoIdValidationPipe() ) id: string): Promise<IResponse>{
        const find = await this.newsService.findById(id);
        if( !find ) throw new BadRequestException('videos not found');
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
        const find = await this.newsService.findById(id);
        if( !find ) throw new BadRequestException('videos not found');
        const data = await this.newsService.update( id,  body);
        return new ResponseSuccess(new VideosItemResponse(data));
    }

    @ApiBearerAuth()
    @Delete(':id')
    async remove(@Param('id', new MongoIdValidationPipe() ) id: string) {
      return await this.newsService.remove(id);
    }



}
