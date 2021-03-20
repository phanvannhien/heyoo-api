import { Controller, Get, Post, Body, Put, Param, Delete, HttpCode, HttpStatus, Query, Res } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ResponseSuccess } from 'src/common/dto/response.dto';
import { IResponse } from 'src/common/interfaces/response.interface';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesResponse } from './responses/categories.response';
import { GetCategoryDto } from './dto/get-category.dto';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOkResponse({
    type: CategoriesResponse
  })
  @HttpCode( HttpStatus.OK )
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<IResponse> {
    const cate = await this.categoriesService.create(createCategoryDto);
    return new ResponseSuccess( new CategoriesResponse(cate) ) ;
  }

  @Get()
  @ApiOkResponse({
    type: [CategoriesResponse]
  })
  @HttpCode( HttpStatus.OK )
  async findAll(): Promise<IResponse> {
    const d = await this.categoriesService.findAll();
    const r = d.map( i => new CategoriesResponse(i) );
    return new ResponseSuccess(r) ;
  }

  @Get('all')
  @ApiOkResponse({
    type: [CategoriesResponse]
  })
  @HttpCode( HttpStatus.OK )
  async findAllCategories( @Res() res, @Query() query: GetCategoryDto ): Promise<IResponse> {
    const d = await this.categoriesService.findAllCategories(query);
    const r = d.map( i => new CategoriesResponse(i) );
    return res.json( {
      data: { 
          items: r,
          total: r.length
      }
    });
  }

  @ApiOkResponse({
    type: CategoriesResponse
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<IResponse> {
    const data = await this.categoriesService.findOne(id)
    return new ResponseSuccess(new CategoriesResponse(data))
  }

  @ApiOkResponse({
    type: CategoriesResponse
  })
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto): Promise<IResponse> {
    const data = await this.categoriesService.update(id, updateCategoryDto);
    return new ResponseSuccess(new CategoriesResponse(data))
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
