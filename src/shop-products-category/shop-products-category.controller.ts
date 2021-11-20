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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('shop-products-category')
@Controller('shop-products-category')
export class ShopProductCategoryController {
  constructor(private readonly categoryService: ShopProductCategoryService) {}

  @Get()
  @ApiOkResponse({
    type: [ShopProductCategoryResponse]
  })
  @ApiBearerAuth()
  @HttpCode( HttpStatus.OK )
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<IResponse> {
    const d = await this.categoryService.findAll();
    const r = d.map( i => new ShopProductCategoryResponse(i) );
    return new ResponseSuccess(r) ;
  }

  @Get('all')
  @ApiOkResponse({
    type: [ShopProductCategoryResponse]
  })
  @ApiBearerAuth()
  @HttpCode( HttpStatus.OK )
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id', new MongoIdValidationPipe()) id: string): Promise<IResponse> {
    const data = await this.categoryService.findOne(id)
    return new ResponseSuccess(new ShopProductCategoryResponse(data))
  }

}
