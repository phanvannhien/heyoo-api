import { Controller, Get, Post, Body, Put, Param, Delete, HttpCode, HttpStatus, Query, Res, BadRequestException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ResponseSuccess } from 'src/common/dto/response.dto';
import { IResponse } from 'src/common/interfaces/response.interface';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesResponse } from './responses/categories.response';
import { GetCategoryDto } from './dto/get-category.dto';
import { MongoIdValidationPipe } from 'src/common/pipes/parse-mongo-id';
import { QueryPaginateDto } from 'src/common/dto/paginate.dto';
import { CategoryLiveStreamResponse } from './responses/category-livestream.response';
import { AdminJWTAuthGuard } from 'src/admin-users/admin-jwt-auth.guard';

@ApiTags('admin')
@Controller('admin-livestream-categories')
export class AdminCategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOkResponse({
    type: CategoriesResponse
  })
  @HttpCode( HttpStatus.OK )
  @ApiBearerAuth()
  @UseGuards(AdminJWTAuthGuard)
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<IResponse> {
    const cate = await this.categoriesService.create(createCategoryDto);
    return new ResponseSuccess( new CategoriesResponse(cate) ) ;
  }

  @Get()
  @ApiOkResponse({
    type: [CategoriesResponse]
  })
  @HttpCode( HttpStatus.OK )
  @ApiBearerAuth()
  @UseGuards(AdminJWTAuthGuard)
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
  @ApiBearerAuth()
  @UseGuards(AdminJWTAuthGuard)
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
  @ApiBearerAuth()
  @UseGuards(AdminJWTAuthGuard)
  async findOne(@Param('id', new MongoIdValidationPipe()) id: string): Promise<IResponse> {
    const data = await this.categoriesService.findOne(id)
    return new ResponseSuccess(new CategoriesResponse(data))
  }

  /**
   * 
   * @param id 
   * @returns 
   */
  @ApiOkResponse({
    type: CategoryLiveStreamResponse
  })
  @Get(':id/livestreams')
  @ApiBearerAuth()
  @UseGuards(AdminJWTAuthGuard)
  async getLiveStreamByCategoryId(
      @Param('id', new MongoIdValidationPipe()) id: string,
      @Query() query: QueryPaginateDto
    ): Promise<IResponse> {
    const data = await this.categoriesService.findOne(id);
    if(!data) throw new BadRequestException('Category not found');
    const response = await this.categoriesService.getLiveByCategory(id, query);
    return new ResponseSuccess(
      new CategoryLiveStreamResponse({
        page: query.page,
        items: response
      })
    );
  }

    /**
   * 
   * @param id 
   * @returns 
   */
     @ApiOkResponse({
      type: CategoryLiveStreamResponse
    })
    @Get('livestreams/all')
    @ApiBearerAuth()
    @UseGuards(AdminJWTAuthGuard)
    async getAllLiveStream(
        @Query() query: QueryPaginateDto
      ): Promise<IResponse> {
   
      const response = await this.categoriesService.getAllLiveStream(query);
      return new ResponseSuccess(
        new CategoryLiveStreamResponse({
          page: query.page,
          items: response
        })
      );
    }
  

  @ApiOkResponse({
    type: CategoriesResponse
  })
  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(AdminJWTAuthGuard)
  async update(@Param('id', new MongoIdValidationPipe()) id: string, @Body() updateCategoryDto: UpdateCategoryDto): Promise<IResponse> {
    const data = await this.categoriesService.update(id, updateCategoryDto);
    return new ResponseSuccess(new CategoriesResponse(data))
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AdminJWTAuthGuard)
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
