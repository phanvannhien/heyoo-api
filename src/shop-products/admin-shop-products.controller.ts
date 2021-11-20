import { Controller, Post, UseInterceptors, Req, Body, UploadedFile, Get, Query, Put,
     Param, BadRequestException, UsePipes, UseGuards, Delete } from '@nestjs/common';
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

@ApiTags('admin')
@Controller('admin-shop-products')
export class AdminShopProductsController {

    constructor(
        private readonly productService: ShopProductsService,
        private readonly fileService: FilesService,
    ) {}



    @Get()
    @ApiBearerAuth()
    @UseGuards(AdminJWTAuthGuard)
    @ApiOkResponse({
        type: ShopProductItemsResponse
    })
    async find( @Query() query: GetShopProductDto ): Promise<IResponse>{
        const d = await this.productService.findPaginate(query);
        return new ResponseSuccess(new ShopProductItemsResponse(d));
    }

    @ApiOkResponse({
        type: ShopProductItemResponse
    })
    @Get(':id')
    @ApiBearerAuth()
    @UseGuards(AdminJWTAuthGuard)
    async get(@Param('id', new MongoIdValidationPipe() ) id: string): Promise<IResponse>{
        const find = await this.productService.findById(id);
        if( !find ) throw new BadRequestException('Product not found');
        return new ResponseSuccess(new ShopProductItemResponse(find));
    }

    

}
