import { Controller, Post, UseInterceptors, Req, Body, UploadedFile, Get, Query, Put, Param, BadRequestException, UsePipes, UseGuards } from '@nestjs/common';
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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PackageItemPaginateResponse } from './responses/package-paginate.response';

@ApiTags('packages')
@Controller('packages')
export class PackageController {

    constructor(
        private readonly productService: PackageService,
        private readonly fileService: FilesService,
    ) {}

    @Get('get/all')
    @ApiOkResponse({
        type: PackageItemsResponse
    })
    @ApiBearerAuth()
    @UseGuards( JwtAuthGuard )
    async getAll(): Promise<IResponse>{
        const d = await this.productService.getAll();
        return new ResponseSuccess( new PackageItemsResponse(d) );
    }

    @Get()
    @ApiOkResponse({
        type: PackageItemPaginateResponse
    })
    @ApiBearerAuth()
    @UseGuards( JwtAuthGuard )
    async find( @Query() query: GetPackageDto ): Promise<IResponse>{
        const d = await this.productService.findPaginate(query);
        return new ResponseSuccess(new PackageItemPaginateResponse(d));
    }

    @ApiOkResponse({
        type: PackageItemResponse
    })
    @Get(':id')
    @ApiBearerAuth()
    @UseGuards( JwtAuthGuard )
    async get(@Param('id', new MongoIdValidationPipe() ) id: string): Promise<IResponse>{
        const find = await this.productService.findById(id);
        if( !find ) throw new BadRequestException('Product not found');
        return new ResponseSuccess(new PackageItemResponse(find));
    }
}
