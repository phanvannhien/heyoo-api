import { Controller, Body, Post, ParseIntPipe, BadRequestException, UseGuards, Req, Get, Query, Inject, forwardRef } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { MongoIdValidationPipe } from 'src/common/pipes/parse-mongo-id';
import { ApiTags, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from 'src/products/products.service';
import { UsersService } from 'src/users/users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OrderItemResponse } from './responses/order-item.response';
import { ResponseSuccess } from 'src/common/dto/response.dto';
import { IResponse } from 'src/common/interfaces/response.interface';
import { OrderItemsResponse } from './responses/order-items.response';
import { GetOrderDto } from './dto/get-orders.dto';
import { WalletsService } from 'src/wallets/wallets.service';
import { AdminJWTAuthGuard } from 'src/admin-users/admin-jwt-auth.guard';

@ApiTags('admin')
@Controller('admin-orders')
export class AdminOrdersController {
    constructor(
        private readonly orderService: OrdersService,
        private readonly productService: ProductsService,
        private readonly walletService: WalletsService,
        private readonly userService: UsersService,
    ){}


    @Get()
    @ApiOkResponse({
        type: OrderItemsResponse
    })
    @ApiBearerAuth()
    @UseGuards(AdminJWTAuthGuard)
    async find( @Query() query: GetOrderDto ): Promise<IResponse>{
        const d = await this.orderService.findAll(query);
        return new ResponseSuccess(new OrderItemsResponse(d));
    }

}
