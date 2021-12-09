import { Controller, Post, UseInterceptors, Req, Body, UploadedFile, Delete,
    Get, Query, Put, Param, BadRequestException, UsePipes, UseGuards 
} from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiBody, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { ShopProductsService } from './shop-products.service';
import { ShopProductItemResponse } from './responses/shop-product.response';
import { CreateShopProductDto } from './dto/create-shop-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { IResponse } from 'src/common/interfaces/response.interface';
import { FilesService } from 'src/files/files.service';
import { ResponseSuccess } from 'src/common/dto/response.dto';
import { GetShopProductDto } from './dto/get-shop-product.dto';
import { ShopProductItemsResponse } from './responses/shop-products.response';
import { UpdateShopProductDto } from './dto/update-shop-product.dto';
import { MongoIdValidationPipe } from 'src/common/pipes/parse-mongo-id';
import { AdminJWTAuthGuard } from 'src/admin-users/admin-jwt-auth.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ShopService } from 'src/shop/shop.service';
import { GetShopProductRelatedDto } from './dto/get-shop-product-related.dto';
import { ShopProductCategoryService } from 'src/shop-products-category/shop-products-category.service';

@ApiTags('shop-products')
@Controller('shop-products')
export class ShopProductsController {

    constructor(
        private readonly productService: ShopProductsService,
        private readonly fileService: FilesService,
        private readonly shopService: ShopService,
        private readonly shopProductCategoryService: ShopProductCategoryService,
    ) {}

    @Get()
    @ApiOkResponse({
        type: ShopProductItemsResponse
    })
    @ApiBearerAuth()
    @UseGuards( JwtAuthGuard )
    async find( @Req() request, @Query() query: GetShopProductDto ): Promise<IResponse>{
        const shopOfUser = await this.shopService.getUserShop(request.user.id);
        const d = await this.productService.findPaginate(shopOfUser, query);
        return new ResponseSuccess(new ShopProductItemsResponse(d));
    }

    @ApiOkResponse({
        type: ShopProductItemResponse
    })
    @Get(':id')
    @ApiBearerAuth()
    @UseGuards( JwtAuthGuard )
    async get(@Param('id', new MongoIdValidationPipe() ) id: string): Promise<IResponse>{
        const find = await this.productService.findById(id);
        if( !find ) throw new BadRequestException('Product not found');
        return new ResponseSuccess(new ShopProductItemResponse(find));
    }

    @ApiOkResponse({
        type: ShopProductItemResponse
    })
    @Get(':id/related')
    @ApiBearerAuth()
    @UseGuards( JwtAuthGuard )
    async getRelated(@Req() request, @Param('id', new MongoIdValidationPipe() ) id: string, @Query() query: GetShopProductRelatedDto ): Promise<IResponse>{
        const find = await this.productService.findById(id);
        if( !find ) throw new BadRequestException('Product not found');
        const shopOfUser = await this.shopService.getUserShop(request.user.id);
        const products = await this.productService.getRelatedProduct(shopOfUser,find, query);
        return new ResponseSuccess(new ShopProductItemsResponse(products));
    }


    @ApiOkResponse({
        type: ShopProductItemResponse
    })
    @ApiBody({
        type: CreateShopProductDto
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post()
    async create( @Req() req, @Body() body: CreateShopProductDto): Promise<IResponse> {
        const shop = await this.shopService.findById( body.shop );
        if(!shop) throw new BadRequestException('Shop not found');
        if(shop.user.id != req.user.id) throw new BadRequestException('User are not owner this shop');

        const findCategory = await this.shopProductCategoryService.findCategoryById(body.category)
        if(!findCategory) throw new BadRequestException('Shop product category not found');

        const data = await this.productService.create(body);
        return new ResponseSuccess(new ShopProductItemResponse(data));
    }


    @ApiOkResponse({
        type: ShopProductItemResponse
    })
    @ApiBody({
        type: UpdateShopProductDto
    })
    @Put(':id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async update(@Req() req, @Param('id', new MongoIdValidationPipe() ) id: string, @Body() body: UpdateShopProductDto): Promise<IResponse> {
        const find = await this.productService.findById(id);
        if( !find ) throw new BadRequestException('Product not found');
        
        const shop = await this.shopService.findById( body.shop );
        if(!shop) throw new BadRequestException('Shop not found');
        if(shop.user.id != req.user.id) throw new BadRequestException('User are not owner this shop');

        const data = await this.productService.update( id,  body);
        return new ResponseSuccess(new ShopProductItemResponse(data));
    }


    @ApiBearerAuth()
    @UseGuards( JwtAuthGuard )
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.productService.remove(id);
    }


}
