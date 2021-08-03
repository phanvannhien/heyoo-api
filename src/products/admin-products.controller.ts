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

@ApiTags('admin')
@Controller('admin-products')
export class AdminProductsController {

    constructor(
        private readonly productService: ProductsService,
        private readonly fileService: FilesService,
    ) {}


    @ApiOkResponse({
        type: ProductItemResponse
    })
    @ApiBody({
        type: CreateProductDto
    })
    @ApiBearerAuth()
    @UseGuards(AdminJWTAuthGuard)
    @Post()
    async create(@Body() body: CreateProductDto): Promise<IResponse> {
        const data = await this.productService.create(body);
        return new ResponseSuccess(new ProductItemResponse(data));
    }

    @Get('get/all')
    @ApiBearerAuth()
    @UseGuards(AdminJWTAuthGuard)
    @ApiOkResponse({
        type: ProductItemsResponse
    })
    async getAll(): Promise<IResponse>{
        const d = await this.productService.getAll();
        return new ResponseSuccess(new ProductItemsResponse(d));
    }

    @Get()
    @ApiBearerAuth()
    @UseGuards(AdminJWTAuthGuard)
    @ApiOkResponse({
        type: ProductItemsResponse
    })
    async find( @Query() query: GetProductDto ): Promise<IResponse>{
        const d = await this.productService.findAll(query);
        return new ResponseSuccess(new ProductItemsResponse(d));
    }

    @ApiOkResponse({
        type: ProductItemResponse
    })
    @Get(':id')
    @ApiBearerAuth()
    @UseGuards(AdminJWTAuthGuard)
    async get(@Param('id', new MongoIdValidationPipe() ) id: string): Promise<IResponse>{
        const find = await this.productService.findById(id);
        if( !find ) throw new BadRequestException('Product not found');
        return new ResponseSuccess(new ProductItemResponse(find));
    }

    @ApiOkResponse({
        type: ProductItemResponse
    })
    @ApiBody({
        type: UpdateProductDto
    })
    @Put(':id')
    @ApiBearerAuth()
    @UseGuards(AdminJWTAuthGuard)
    async update(@Param('id', new MongoIdValidationPipe() ) id: string, @Body() body: UpdateProductDto): Promise<IResponse> {
        const find = await this.productService.findById(id);
        if( !find ) throw new BadRequestException('Product not found');
        const data = await this.productService.update( id,  body);
        return new ResponseSuccess(new ProductItemResponse(data));
    }

}
