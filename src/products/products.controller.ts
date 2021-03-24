import { Controller, Post, UseInterceptors, Req, Body, UploadedFile, Get, Query, Put, Param, BadRequestException, UsePipes } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiBody, ApiConsumes } from '@nestjs/swagger';
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

@ApiTags('products')
@Controller('products')
export class ProductsController {

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
    @ApiConsumes('multipart/form-data')
    @Post()
    @UseInterceptors(FileInterceptor('image'))
    async create(@Body() body: CreateProductDto, @UploadedFile() image): Promise<IResponse> {
        const imageUploaded = await this.fileService.uploadPublicFile(image.buffer, image.originalname);

        const createData = {
            productName: body.productName,
            price: body.price,
            image: imageUploaded
        };

        const data = await this.productService.create(createData);
        return new ResponseSuccess(new ProductItemResponse(data));
    }


    @Get()
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
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('image'))
    @Put(':id')
    async update(@Param('id', new MongoIdValidationPipe() ) id: string, @Body() body: UpdateProductDto, @UploadedFile() image): Promise<IResponse> {
        const find = await this.productService.findById(id);
        if( !find ) throw new BadRequestException('Product not found');
      
        if( image ){
            
            const imageUploaded = await this.fileService.uploadPublicFile(image.buffer, image.originalname);
            body.image = imageUploaded;
        }
        const data = await this.productService.update( id,  body);
        return new ResponseSuccess(new ProductItemResponse(data));
    }

}
