import { Controller, Get, Post, Body, Put, Param, Delete, HttpCode, HttpStatus, Query, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ResponseSuccess } from 'src/common/dto/response.dto';
import { IResponse } from 'src/common/interfaces/response.interface';
import { ShopProductCategoryService } from './shop-products-category.service';
import { CreateShopProductCategoryDto } from './dto/create-shop-products-category.dto';
import { UpdateShopProductCategoryDto } from './dto/update-shop-products-category.dto';
import { ShopProductCategoryResponse } from './responses/shop-products-category.response';
import { GetShopProductCategoryDto } from './dto/get-shop-products-category.dto';
import { MongoIdValidationPipe } from 'src/common/pipes/parse-mongo-id';
import { AdminJWTAuthGuard } from 'src/admin-users/admin-jwt-auth.guard';

@ApiTags('admin')
@Controller('admin-shop-products-category')
export class AdminShopProductCategoryController {
  constructor(private readonly categoryService: ShopProductCategoryService) {}

  @Post()
  @ApiOkResponse({
    type: ShopProductCategoryResponse
  })
  @HttpCode( HttpStatus.OK )
  @ApiBearerAuth()
  @UseGuards(AdminJWTAuthGuard)
  async create(@Body() createCategoryDto: CreateShopProductCategoryDto): Promise<IResponse> {
    const cate = await this.categoryService.create(createCategoryDto);
    return new ResponseSuccess( new ShopProductCategoryResponse(cate) ) ;
  }

  @Get()
  @ApiOkResponse({
    type: [ShopProductCategoryResponse]
  })
  @HttpCode( HttpStatus.OK )
  @ApiBearerAuth()
  @UseGuards(AdminJWTAuthGuard)
  async findAll(): Promise<IResponse> {
    const d = await this.categoryService.findAll();
    const r = d.map( i => new ShopProductCategoryResponse(i) );
    return new ResponseSuccess(r) ;
  }

  @Get('all')
  @ApiOkResponse({
    type: [ShopProductCategoryResponse]
  })
  @HttpCode( HttpStatus.OK )
  @ApiBearerAuth()
  @UseGuards(AdminJWTAuthGuard)
  async findAllCategories( @Res() res, @Query() query: GetShopProductCategoryDto ): Promise<IResponse> {
    const d = await this.categoryService.findAllCategories(query);
    const r = d.map( i => new ShopProductCategoryResponse(i) );
    return res.json( {
      data: { 
          items: r,
          total: r.length
      }
    });
  }

  @ApiOkResponse({
    type: ShopProductCategoryResponse
  })
  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AdminJWTAuthGuard)
  async findOne(@Param('id', new MongoIdValidationPipe()) id: string): Promise<IResponse> {
    const data = await this.categoryService.findOne(id)
    return new ResponseSuccess(new ShopProductCategoryResponse(data))
  }

  @ApiOkResponse({
    type: ShopProductCategoryResponse
  })
  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(AdminJWTAuthGuard)
  async update(
      @Param('id', new MongoIdValidationPipe()) id: string, 
      @Body() updateCategoryDto: UpdateShopProductCategoryDto
    ): Promise<IResponse> {
    const data = await this.categoryService.update(id, updateCategoryDto);
    return new ResponseSuccess(new ShopProductCategoryResponse(data))
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AdminJWTAuthGuard)
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
