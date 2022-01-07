import { Controller, Post, UseInterceptors, Req, Body, UploadedFile, Get, Query, Put, Param, BadRequestException, UsePipes, UseGuards, Delete } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiBody, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { PackageService } from './package.service';
import { PackageItemResponse } from './responses/package.response';
import { CreatePackageDto } from './dto/create-package.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { IResponse } from 'src/common/interfaces/response.interface';
import { FilesService } from 'src/files/files.service';
import { ResponseSuccess } from 'src/common/dto/response.dto';
import { GetPackageDto } from './dto/get-package.dto';
import { PackageItemsResponse } from './responses/packages.response';
import { UpdatePackageDto } from './dto/update-package.dto';
import { MongoIdValidationPipe } from 'src/common/pipes/parse-mongo-id';
import { AdminJWTAuthGuard } from 'src/admin-users/admin-jwt-auth.guard';
import { PackageItemPaginateResponse } from './responses/package-paginate.response';

@ApiTags('admin')
@Controller('admin-packages')
export class AdminPackageController {

    constructor(
        private readonly productService: PackageService,
        private readonly fileService: FilesService,
    ) {}


    @ApiOkResponse({
        type: PackageItemResponse
    })
    @ApiBody({
        type: CreatePackageDto
    })
    @ApiBearerAuth()
    @UseGuards(AdminJWTAuthGuard)
    @Post()
    async create(@Body() body: CreatePackageDto): Promise<IResponse> {
        const data = await this.productService.create(body);
        return new ResponseSuccess(new PackageItemResponse(data));
    }

    @Get('get/all')
    @ApiBearerAuth()
    @UseGuards(AdminJWTAuthGuard)
    @ApiOkResponse({
        type: PackageItemsResponse
    })
    async getAll(): Promise<IResponse>{
        const d = await this.productService.getAll();
        return new ResponseSuccess(new PackageItemsResponse(d));
    }

    @Get()
    @ApiBearerAuth()
    @UseGuards(AdminJWTAuthGuard)
    @ApiOkResponse({
        type: PackageItemPaginateResponse
    })
    async find( @Query() query: GetPackageDto ): Promise<IResponse>{
        const d = await this.productService.findPaginate(query);
        return new ResponseSuccess(new PackageItemPaginateResponse(d));
    }

    @ApiOkResponse({
        type: PackageItemResponse
    })
    @Get(':id')
    @ApiBearerAuth()
    @UseGuards(AdminJWTAuthGuard)
    async get(@Param('id', new MongoIdValidationPipe() ) id: string): Promise<IResponse>{
        const find = await this.productService.findById(id);
        if( !find ) throw new BadRequestException('Product not found');
        return new ResponseSuccess(new PackageItemResponse(find));
    }

    @ApiOkResponse({
        type: PackageItemResponse
    })
    @ApiBody({
        type: UpdatePackageDto
    })
    @Put(':id')
    @ApiBearerAuth()
    @UseGuards(AdminJWTAuthGuard)
    async update(@Param('id', new MongoIdValidationPipe() ) id: string, @Body() body: UpdatePackageDto): Promise<IResponse> {
        const find = await this.productService.findById(id);
        if( !find ) throw new BadRequestException('Product not found');
        const data = await this.productService.update( id,  body);
        return new ResponseSuccess(new PackageItemResponse(data));
    }


    @ApiBearerAuth()
    @UseGuards( AdminJWTAuthGuard )
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.productService.remove(id);
    }

}
