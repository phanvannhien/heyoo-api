import { Controller, Post, UseInterceptors, Req, Body, UploadedFile, Get, Query, Put, Param, BadRequestException, UsePipes, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiBody, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { ProductItemResponse } from './responses/product.response';
import { CreateProductDto } from './dto/create-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { IResponse } from 'src/common/interfaces/response.interface';
import { FilesService } from 'src/files/files.service';
import { ResponseSuccess } from 'src/common/dto/response.dto';
import { GetProductDto } from './dto/get-product.dto';
import { ProductItemsResponse } from './responses/products.response';
import { UpdateProductDto } from './dto/update-product.dto';
import { MongoIdValidationPipe } from 'src/common/pipes/parse-mongo-id';
import { AdminJWTAuthGuard } from 'src/admin-users/admin-jwt-auth.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('products')
@Controller('products')
export class ProductsController {

    constructor(
        private readonly productService: ProductsService,
        private readonly fileService: FilesService,
    ) {}


    @Get('get/all')
    @ApiOkResponse({
        type: ProductItemsResponse
    })
    @ApiBearerAuth()
    @UseGuards( JwtAuthGuard )
    async getAll(): Promise<IResponse>{
        const d = await this.productService.getAll();
        return new ResponseSuccess(new ProductItemsResponse(d));
    }

    @Get()
    @ApiOkResponse({
        type: ProductItemsResponse
    })
    @ApiBearerAuth()
    @UseGuards( JwtAuthGuard )
    async find( @Query() query: GetProductDto ): Promise<IResponse>{
        const d = await this.productService.findAll(query);
        return new ResponseSuccess(new ProductItemsResponse(d));
    }

    @ApiOkResponse({
        type: ProductItemResponse
    })
    @Get(':id')
    @ApiBearerAuth()
    @UseGuards( JwtAuthGuard )
    async get(@Param('id', new MongoIdValidationPipe() ) id: string): Promise<IResponse>{
        const find = await this.productService.findById(id);
        if( !find ) throw new BadRequestException('Product not found');
        return new ResponseSuccess(new ProductItemResponse(find));
    }


}
