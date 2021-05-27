import { Controller, Get, Post, Body, Put, Param, Delete, HttpCode, HttpStatus, Query, Res } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ResponseSuccess } from 'src/common/dto/response.dto';
import { IResponse } from 'src/common/interfaces/response.interface';
import { NewsCategoriesService } from './news-categories.service';
import { CreateNewsCategoryDto } from './dto/create-news-category.dto';
import { UpdateNewsCategoryDto } from './dto/update-category.dto';
import { NewsCategoriesResponse } from './responses/news-categories.response';
import { GetNewsCategoryDto } from './dto/get-news-category.dto';
import { MongoIdValidationPipe } from 'src/common/pipes/parse-mongo-id';

@ApiTags('news-categories')
@Controller('news-categories')
export class NewsCategoriesController {
  constructor(private readonly newsCategoriesService: NewsCategoriesService) {}

  @Post()
  @ApiOkResponse({
    type: NewsCategoriesResponse
  })
  @HttpCode( HttpStatus.OK )
  async create(@Body() createCategoryDto: CreateNewsCategoryDto): Promise<IResponse> {
    const cate = await this.newsCategoriesService.create(createCategoryDto);
    return new ResponseSuccess( new NewsCategoriesResponse(cate) ) ;
  }

  @Get()
  @ApiOkResponse({
    type: [NewsCategoriesResponse]
  })
  @HttpCode( HttpStatus.OK )
  async findAll(): Promise<IResponse> {
    const d = await this.newsCategoriesService.findAll();
    const r = d.map( i => new NewsCategoriesResponse(i) );
    return new ResponseSuccess(r) ;
  }

  @Get('all')
  @ApiOkResponse({
    type: [NewsCategoriesResponse]
  })
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
  async findOne(@Param('id', new MongoIdValidationPipe()) id: string): Promise<IResponse> {
    const data = await this.newsCategoriesService.findOne(id)
    return new ResponseSuccess(new NewsCategoriesResponse(data))
  }

  @ApiOkResponse({
    type: NewsCategoriesResponse
  })
  @Put(':id')
  async update(@Param('id', new MongoIdValidationPipe()) id: string, @Body() updateCategoryDto: UpdateNewsCategoryDto): Promise<IResponse> {
    const data = await this.newsCategoriesService.update(id, updateCategoryDto);
    return new ResponseSuccess(new NewsCategoriesResponse(data))
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsCategoriesService.remove(id);
  }
}
