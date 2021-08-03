import { Controller, Get, Post, Body, Put, Param, Delete, HttpCode, HttpStatus, Query, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ResponseSuccess } from 'src/common/dto/response.dto';
import { IResponse } from 'src/common/interfaces/response.interface';
import { VideoCategoriesService } from './video-categories.service';
import { CreateVideoCategoryDto } from './dto/create-video-category.dto';
import { UpdateVideoCategoryDto } from './dto/update-video.dto';
import { VideoCategoriesResponse } from './responses/video-categories.response';
import { GetVideoCategoryDto } from './dto/get-video-category.dto';
import { MongoIdValidationPipe } from 'src/common/pipes/parse-mongo-id';
import { AdminJWTAuthGuard } from 'src/admin-users/admin-jwt-auth.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('video-categories')
@Controller('video-categories')
export class VideoCategoriesController {
  constructor(private readonly videoCategoriesService: VideoCategoriesService) {}

  @Get()
  @ApiOkResponse({
    type: [VideoCategoriesResponse]
  })
  @HttpCode( HttpStatus.OK )
  @ApiBearerAuth()
  @UseGuards( JwtAuthGuard )
  async findAll(): Promise<IResponse> {
    const d = await this.videoCategoriesService.findAll();
    const r = d.map( i => new VideoCategoriesResponse(i) );
    return new ResponseSuccess(r) ;
  }

  @Get('all')
  @ApiOkResponse({
    type: [VideoCategoriesResponse]
  })
  @ApiBearerAuth()
  @UseGuards( JwtAuthGuard )
  @HttpCode( HttpStatus.OK )
  async findAllCategories( @Res() res, @Query() query: GetVideoCategoryDto ): Promise<IResponse> {
    const d = await this.videoCategoriesService.findAllCategories(query);
    const r = d.map( i => new VideoCategoriesResponse(i) );
    return res.json( {
      data: { 
          items: r,
          total: r.length
      }
    });
  }

  @ApiOkResponse({
    type: VideoCategoriesResponse
  })
  @Get(':id')
  @ApiBearerAuth()
  @UseGuards( JwtAuthGuard )
  async findOne(@Param('id', new MongoIdValidationPipe()) id: string  ): Promise<IResponse> {
    const data = await this.videoCategoriesService.findOne(id)
    return new ResponseSuccess(new VideoCategoriesResponse(data))
  }

}
