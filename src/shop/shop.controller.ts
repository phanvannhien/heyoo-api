import { Controller, Post, UseInterceptors, Req, Body, UploadedFile, Get, Query, Put, Param, BadRequestException, UsePipes, UseGuards, UploadedFiles, Res, Delete, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiBody, ApiConsumes, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { ShopService } from './shop.service';
import { ShopItemResponse } from './responses/shop.response';
import { CreateShopDto } from './dto/create-shop.dto';
import { IResponse } from 'src/common/interfaces/response.interface';
import { ResponseSuccess } from 'src/common/dto/response.dto';
import { GetShopDto } from './dto/get-shop.dto';
import { ShopsResponse } from './responses/shop-paginate.response';
import { UpdateShopDto } from './dto/update-shop.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { MongoIdValidationPipe } from 'src/common/pipes/parse-mongo-id';
import { ShopEntityDocument } from './entities/shop.entity';
import { ShopCategoriesService } from 'src/shop-categories/shop-categories.service';


@ApiTags('shop')
@Controller('shop')
export class ShopController {

    constructor(
        private readonly shopService: ShopService,
        private readonly shopCategoryService: ShopCategoriesService,
    ) {}

    @ApiOkResponse({ type: ShopItemResponse })
    @ApiBody({ type: CreateShopDto })
    @ApiBearerAuth()
    @UseGuards( JwtAuthGuard )
    @Post()
    async create( 
        @Req() req, 
        @Body() body: CreateShopDto,
    ): Promise<IResponse>
    {
        const foundCat = await this.shopCategoryService.findCategoryById(body.category);
        if(!foundCat) throw new BadRequestException('Category not found');
        const createData = { 
            ...body,
            user: req.user.id,
        };
        const data = await this.shopService.create(createData);
        return new ResponseSuccess(new ShopItemResponse(data));
    }


    @Get()
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: [ShopsResponse]
    })
    async find( @Query() query: GetShopDto ): Promise<IResponse>{
        const d = await this.shopService.findAll(query);
        return new ResponseSuccess(new ShopsResponse(d));
    }

    @ApiOkResponse({ type: ShopItemResponse  })
    @ApiBearerAuth()
    @Get(':id')
    async get(@Param('id', new MongoIdValidationPipe() ) id: string): Promise<IResponse>{
        const find: ShopEntityDocument = await this.shopService.findById(id);
        if( !find ) throw new BadRequestException('videos not found');
        const updateView = {
            viewCount: find.viewCount + 1
        }
        await this.shopService.update( id, updateView );
        return new ResponseSuccess(new ShopItemResponse(find));
    }


    @ApiOkResponse({ type: ShopItemResponse })
    @ApiBody({ type: UpdateShopDto })
    @ApiBearerAuth()
    @Put(':id')
    async update(
            @Param('id', new MongoIdValidationPipe() ) id: string,
            @Body() body: UpdateShopDto
        ): Promise<IResponse> {
            
        const find = await this.shopService.findById(id);
        if( !find ) throw new BadRequestException('shop not found');

        const foundCat = await this.shopCategoryService.findCategoryById(body.category);
        if(!foundCat) throw new BadRequestException('Category not found');

        const data = await this.shopService.update( id,  body);
        return new ResponseSuccess(new ShopItemResponse(data));
    }

    @ApiBearerAuth()
    @Delete(':id')
    async remove(@Param('id', new MongoIdValidationPipe() ) id: string) {
      return await this.shopService.remove(id);
    }


}
