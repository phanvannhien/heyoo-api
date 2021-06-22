import { Controller, Post, UseInterceptors, Req, Body, UploadedFile, Get, Query, Put, Param, BadRequestException, UsePipes, UseGuards, UploadedFiles, Res, Delete, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiBody, ApiConsumes, ApiBearerAuth, ApiParam, ApiResponse } from '@nestjs/swagger';
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
import { ShopFollowResponse } from './responses/shop-follow.response';


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
        const shop = await this.shopService.create(createData);
        const responseData = {
            ...shop.toObject(),
            followCount: await this.shopService.getCountShopFollow(shop)
        };

        return new ResponseSuccess(new ShopItemResponse(responseData));
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
        const shop: ShopEntityDocument = await this.shopService.findById(id);
        if( !shop ) throw new BadRequestException('Shop not found');
        const updateView = {
            viewCount: shop.viewCount + 1
        }
        await this.shopService.update( id, updateView );
        const responseData = {
            ...shop.toObject(),
            followCount: await this.shopService.getCountShopFollow(shop)
        };
        return new ResponseSuccess(new ShopItemResponse(responseData));
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

        const shop = await this.shopService.update( id,  body);

        const responseData = {
            ...shop.toObject(),
            followCount: await this.shopService.getCountShopFollow(shop)
        };

        return new ResponseSuccess(new ShopItemResponse(responseData));
    }

    @ApiBearerAuth()
    @Delete(':id')
    async remove(@Param('id', new MongoIdValidationPipe() ) id: string) {
      return await this.shopService.remove(id);
    }


    /**
     * FOLLOWS
     */

    @ApiResponse({
        type: ShopFollowResponse
    })
    @ApiBearerAuth()
    @Post(':shopId/dofollow')
    @HttpCode( HttpStatus.OK )
    @UseGuards(JwtAuthGuard)
    async doFollow( @Req() request, @Param('shopId', new MongoIdValidationPipe() ) shopId: string ): Promise<IResponse> {
        const find = await this.shopService.findById(shopId);
        if (!find) throw new BadRequestException('User not found');
        const follow = await this.shopService.doFollow(request.user.id, shopId);
        return new ResponseSuccess( new ShopFollowResponse(follow) )
    }

    @ApiOkResponse()
    @ApiBearerAuth()
    @Post(':shopId/unfollow')
    @HttpCode( HttpStatus.OK )
    @UseGuards(JwtAuthGuard)
    async unFollow( @Req() request, @Param('shopId', new MongoIdValidationPipe() ) shopId: string ): Promise<any> {
        const d = await this.shopService.unFollow(request.user.id, shopId);
        return new ResponseSuccess( d )
    }

}
