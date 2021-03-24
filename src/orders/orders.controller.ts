import { Controller, Body, Post, ParseIntPipe, BadRequestException, UseGuards, Req } from '@nestjs/common';
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

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
    constructor(
        private readonly orderService: OrdersService,
        private readonly productService: ProductsService,
        private readonly userService: UsersService,
    ){}

    @ApiBearerAuth()
    @ApiOkResponse({
        type: OrderItemResponse
    })
    @UseGuards(JwtAuthGuard)
    @Post()
    async create(
        @Req() request,
        @Body('product', new MongoIdValidationPipe() ) product: string,
        @Body() body: CreateOrderDto
    ): Promise<IResponse>
    {
        const productFind = await this.productService.findById(product);
        if(!productFind) throw new BadRequestException('Product not found')

        const create = {
            user: request.user.id,
            product: productFind.id,
            price: productFind.price,
            quantity: body.quantity,
            total: productFind.price * body.quantity,
            payment_method: body.payment_method,
            status: 'success',
        }

        const d = await this.orderService.create(create);
        return new ResponseSuccess( new OrderItemResponse(d));


    }
}
