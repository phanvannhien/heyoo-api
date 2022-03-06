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
import { QueryPaginateDto } from 'src/common/dto/paginate.dto';
import { ShopVideoResponse } from './responses/shop-videos.response';
import { AdminJWTAuthGuard } from 'src/admin-users/admin-jwt-auth.guard';
import { INotifyMessageBody } from 'src/firebase/firebase.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { UsersService } from 'src/users/users.service';

@ApiTags('admin')
@Controller('admin-shop')
export class AdminShopController {

    constructor(
        private readonly shopService: ShopService,
        private readonly shopCategoryService: ShopCategoriesService,
        private readonly notifyService: NotificationsService,
        private readonly userService: UsersService,
    ) {}


    @Get()
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: [ShopsResponse]
    })
    @UseGuards( AdminJWTAuthGuard )
    async find( @Query() query: GetShopDto ): Promise<IResponse>{
        const d = await this.shopService.findAll(query);
        return new ResponseSuccess(new ShopsResponse( d[0] ));
    }

    @ApiOkResponse({ type: ShopItemResponse  })
    @ApiBearerAuth()
    @UseGuards( AdminJWTAuthGuard )
    @Get(':id')
    async get(
            @Param('id', new MongoIdValidationPipe() ) id: string,
            @Req() request,
        ): Promise<IResponse>{
        const shop = await this.shopService.findShopProfile(id, request);

        if( !shop[0] ) throw new BadRequestException('Shop not found');
        const updateView = {
            viewCount: shop[0].viewCount + 1
        }
        await this.shopService.update( id, updateView );
        return new ResponseSuccess(new ShopItemResponse(shop[0]));
    }

    @ApiOkResponse({ type: ShopVideoResponse  })
    @ApiBearerAuth()
    @Get(':id/videos')
    @UseGuards( AdminJWTAuthGuard )
    async getVideo(
            @Param('id', new MongoIdValidationPipe() ) id: string,
            @Query() paginateQuery: QueryPaginateDto
        ): Promise<IResponse>{
        const shop = await this.shopService.getShopVideos(id, paginateQuery);
        return new ResponseSuccess(new ShopVideoResponse(shop[0]));
    }


    @ApiOkResponse({ type: ShopItemResponse })
    @ApiBody({ type: UpdateShopDto })
    @ApiBearerAuth()
    @UseGuards( AdminJWTAuthGuard )
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
    @UseGuards( AdminJWTAuthGuard )
    @Delete(':id')
    async remove(@Param('id', new MongoIdValidationPipe() ) id: string) {
        const shop = await this.shopService.findById(id);
        if( !shop ) throw new BadRequestException('shop not found');

        const notifyData = {
            title: `System notification`,
            body: `Your shop was removed because it violated our Community Guidelines. Please check these guidelines for more details.`,
            imageUrl: 'https://d21y6rmzuyq1qt.cloudfront.net/27a2ff52-6ae1-49e3-bde6-6427b661588f',
            clickAction: 'VIEW_PRIVACY_POLICY',
            metaData: {
                shopId: id.toString()
            },
        } as INotifyMessageBody

        const fcmTokens = await this.userService.getUserFcmToken( shop.user.id );
        this.notifyService.sendNotify(fcmTokens, notifyData, shop.user.id );

        return await this.shopService.remove(id);
    }



}
