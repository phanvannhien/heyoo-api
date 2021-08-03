import { Controller, Get, Post, Body, Put, Param, Delete, HttpCode, HttpStatus, Query, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ResponseSuccess } from 'src/common/dto/response.dto';
import { IResponse } from 'src/common/interfaces/response.interface';
import { NewsCategoriesService } from './news-categories.service';
import { CreateNewsCategoryDto } from './dto/create-news-category.dto';
import { UpdateNewsCategoryDto } from './dto/update-category.dto';
import { NewsCategoriesResponse } from './responses/news-categories.response';
import { GetNewsCategoryDto } from './dto/get-news-category.dto';
import { MongoIdValidationPipe } from 'src/common/pipes/parse-mongo-id';
import { AdminJWTAuthGuard } from 'src/admin-users/admin-jwt-auth.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('news-categories')
@Controller('news-categories')
export class NewsCategoriesController {
  constructor(private readonly newsCategoriesService: NewsCategoriesService) {}


  @Get()
  @ApiOkResponse({
    type: [NewsCategoriesResponse]
  })
  @HttpCode( HttpStatus.OK )
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<IResponse> {
    const d = await this.newsCategoriesService.findAll();
    const r = d.map( i => new NewsCategoriesResponse(i) );
    return new ResponseSuccess(r) ;
  }

  @Get('all')
  @ApiOkResponse({
    type: [NewsCategoriesResponse]
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode( HttpStatus.OK )
  async findAllCategories( @Res() res, @Query() query: GetNewsCategoryDto ): Promise<IResponse> {
    const d = await this.newsCategoriesService.findAllCategories(query);
    const r = d.map( i => new NewsCategoriesResponse(i) );
    return res.json( {
      data: { 
          items: r,
          total: r.length
      }
    });
  }

  @ApiOkResponse({
    type: NewsCategoriesResponse
  })
  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id', new MongoIdValidationPipe()) id: string): Promise<IResponse> {
    const data = await this.newsCategoriesService.findOne(id)
    return new ResponseSuccess(new NewsCategoriesResponse(data))
  }


}
