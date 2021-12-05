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

@ApiTags('shop-products')
@Controller('shop-products')
export class ShopProductsController {

    constructor(
        private readonly productService: ShopProductsService,
        private readonly fileService: FilesService,
        private readonly shopService: ShopService
    ) {}

    @Get()
    @ApiOkResponse({
        type: ShopProductItemsResponse
    })
    @ApiBearerAuth()
    @UseGuards( JwtAuthGuard )
    async find( @Query() query: GetShopProductDto ): Promise<IResponse>{
        const d = await this.productService.findPaginate(query);
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
    async getRelated(@Param('id', new MongoIdValidationPipe() ) id: string, @Query() query: GetShopProductRelatedDto ): Promise<IResponse>{
        const find = await this.productService.findById(id);
        if( !find ) throw new BadRequestException('Product not found');

        const products = await this.productService.getRelatedProduct(find, query);
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
