import { Controller, Post, UseInterceptors, Req, Body, UploadedFile, Get, Query, Put, Param, BadRequestException, UsePipes, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiBody, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { LevelService } from './level.service';
import { LevelItemResponse } from './responses/level.response';
import { CreateLevelDto } from './dto/create-level.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { IResponse } from 'src/common/interfaces/response.interface';
import { FilesService } from 'src/files/files.service';
import { ResponseSuccess } from 'src/common/dto/response.dto';
import { GetLevelDto } from './dto/get-level.dto';
import { LevelItemsResponse } from './responses/level-paginate.response';
import { UpdateLevelDto } from './dto/update-level.dto';
import { MongoIdValidationPipe } from 'src/common/pipes/parse-mongo-id';
import { AdminJWTAuthGuard } from 'src/admin-users/admin-jwt-auth.guard';

@ApiTags('admin')
@Controller('admin-level')
export class LevelController {

    constructor(
        private readonly levelService: LevelService,
    ) {}

    @ApiOkResponse({
        type: LevelItemResponse
    })
    @ApiBody({
        type: CreateLevelDto
    })
    @ApiBearerAuth()
    @UseGuards(AdminJWTAuthGuard)
    @Post()
    async create(@Body() body: CreateLevelDto): Promise<IResponse> {
        const data = await this.levelService.create(body);
        return new ResponseSuccess(new LevelItemResponse(data));
    }


    @Get()
    @ApiOkResponse({
        type: LevelItemsResponse
    })
    @ApiBearerAuth()
    @UseGuards(AdminJWTAuthGuard)
    async find( @Query() query: GetLevelDto ): Promise<IResponse>{
        const d = await this.levelService.findAll(query);
        return new ResponseSuccess(new LevelItemsResponse(d));
    }

    @ApiOkResponse({
        type: LevelItemResponse
    })
    @Get(':id')
    @ApiBearerAuth()
    @UseGuards(AdminJWTAuthGuard)
    async get(@Param('id', new MongoIdValidationPipe() ) id: string): Promise<IResponse>{
        const find = await this.levelService.findById(id);
        if( !find ) throw new BadRequestException('Level not found');
        return new ResponseSuccess(new LevelItemResponse(find));
    }

    @ApiOkResponse({
        type: LevelItemResponse
    })
    @ApiBody({
        type: UpdateLevelDto
    })
    @Put(':id')
    @ApiBearerAuth()
    @UseGuards(AdminJWTAuthGuard)
    async update(@Param('id', new MongoIdValidationPipe() ) id: string, @Body() body: UpdateLevelDto): Promise<IResponse> {
        const find = await this.levelService.findById(id);
        if( !find ) throw new BadRequestException('Level not found');
        const data = await this.levelService.update( id,  body);
        return new ResponseSuccess(new LevelItemResponse(data));
    }

}
