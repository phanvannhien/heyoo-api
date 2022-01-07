import { Controller, Get, Post, Body, Put, Param, Delete, HttpCode, HttpStatus, Query, Res, BadRequestException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ResponseSuccess } from 'src/common/dto/response.dto';
import { IResponse } from 'src/common/interfaces/response.interface';
import { CategoriesService } from './categories.service';
import { CategoriesResponse } from './responses/categories.response';
import { GetCategoryDto } from './dto/get-category.dto';
import { MongoIdValidationPipe } from 'src/common/pipes/parse-mongo-id';
import { QueryPaginateDto } from 'src/common/dto/paginate.dto';
import { CategoryLiveStreamResponse } from './responses/category-livestream.response';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@ApiTags('livestream-categories')
@Controller('livestream-categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOkResponse({
    type: [CategoriesResponse]
  })
  @HttpCode( HttpStatus.OK )
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id/livestreams')
  async getLiveStreamByCategoryId(
      @Param('id', new MongoIdValidationPipe()) id: string,
      @Query() query: QueryPaginateDto
    ): Promise<IResponse> {
    const data = await this.categoriesService.findOne(id);
    if(!data) throw new BadRequestException('Category not found');
    const response = await this.categoriesService.getLiveByCategory(id, query);
    console.log(response)
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
    @UseGuards(JwtAuthGuard)
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
  

}
