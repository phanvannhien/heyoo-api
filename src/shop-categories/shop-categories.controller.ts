import { Controller, Get, Post, Body, Put, Param, Delete, HttpCode, HttpStatus, Query, Res } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ResponseSuccess } from 'src/common/dto/response.dto';
import { IResponse } from 'src/common/interfaces/response.interface';
import { ShopCategoriesService } from './shop-categories.service';
import { CreateShopCategoryDto } from './dto/create-shop-category.dto';
import { UpdateShopCategoryDto } from './dto/update-shop.dto';
import { ShopCategoriesResponse } from './responses/shop-categories.response';
import { GetShopCategoryDto } from './dto/get-shop-category.dto';
import { MongoIdValidationPipe } from 'src/common/pipes/parse-mongo-id';

@ApiTags('shop-categories')
@Controller('shop-categories')
export class ShopCategoriesController {
  constructor(private readonly categoryService: ShopCategoriesService) {}

  @Post()
  @ApiOkResponse({
    type: ShopCategoriesResponse
  })
  @HttpCode( HttpStatus.OK )
  async create(@Body() createCategoryDto: CreateShopCategoryDto): Promise<IResponse> {
    const cate = await this.categoryService.create(createCategoryDto);
    return new ResponseSuccess( new ShopCategoriesResponse(cate) ) ;
  }

  @Get()
  @ApiOkResponse({
    type: [ShopCategoriesResponse]
  })
  @HttpCode( HttpStatus.OK )
  async findAll(): Promise<IResponse> {
    const d = await this.categoryService.findAll();
    const r = d.map( i => new ShopCategoriesResponse(i) );
    return new ResponseSuccess(r) ;
  }

  @Get('all')
  @ApiOkResponse({
    type: [ShopCategoriesResponse]
  })
  @HttpCode( HttpStatus.OK )
  async findAllCategories( @Res() res, @Query() query: GetShopCategoryDto ): Promise<IResponse> {
    const d = await this.categoryService.findAllCategories(query);
    const r = d.map( i => new ShopCategoriesResponse(i) );
    return res.json( {
      data: { 
          items: r,
          total: r.length
      }
    });
  }

  @ApiOkResponse({
    type: ShopCategoriesResponse
  })
  @Get(':id')
  async findOne(@Param('id', new MongoIdValidationPipe()) id: string): Promise<IResponse> {
    const data = await this.categoryService.findOne(id)
    return new ResponseSuccess(new ShopCategoriesResponse(data))
  }

  @ApiOkResponse({
    type: ShopCategoriesResponse
  })
  @Put(':id')
  async update(
      @Param('id', new MongoIdValidationPipe()) id: string, 
      @Body() updateCategoryDto: UpdateShopCategoryDto
    ): Promise<IResponse> {
    const data = await this.categoryService.update(id, updateCategoryDto);
    return new ResponseSuccess(new ShopCategoriesResponse(data))
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
