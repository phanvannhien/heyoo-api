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
import { ShopService } from 'src/shop/shop.service';
import { INotifyMessageBody } from 'src/firebase/firebase.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { UsersService } from 'src/users/users.service';

@ApiTags('admin')
@Controller('admin-shop-products')
export class AdminShopProductsController {

    constructor(
        private readonly productService: ShopProductsService,
        private readonly fileService: FilesService,
        private readonly shopService: ShopService,
        private readonly notifyService: NotificationsService,
        private readonly userService: UsersService,
    ) {}


    @Get()
    @ApiBearerAuth()
    @UseGuards(AdminJWTAuthGuard)
    @ApiOkResponse({
        type: ShopProductItemsResponse
    })
    async find( @Query() query: GetShopProductDto ): Promise<IResponse>{
        const d = await this.productService.findAdminPaginate(query);
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

    @ApiBearerAuth()
    @UseGuards( AdminJWTAuthGuard )
    @Delete(':id')
    async remove(@Param('id') id: string) {
        const find = await this.productService.findById(id);
        if( !find ) throw new BadRequestException('Product not found');

        const shop = await this.shopService.findById(find.shop);
        if( !shop ) throw new BadRequestException('shop not found');
    
        const notifyData = {
            title: `System notification`,
            body: `The product ${find.productName} was removed because it violated our Community Guidelines. Please check these guidelines for more details.`,
            imageUrl: 'https://d21y6rmzuyq1qt.cloudfront.net/27a2ff52-6ae1-49e3-bde6-6427b661588f',
            clickAction: 'VIEW_PRIVACY_POLICY',
            metaData: {
                shopId: id.toString()
            },
        } as INotifyMessageBody
    
        const fcmTokens = await this.userService.getUserFcmToken( shop.user.id );
        this.notifyService.sendNotify(fcmTokens, notifyData, shop.user.id );
        
        return await this.productService.remove(id);
    }


    

    

}
