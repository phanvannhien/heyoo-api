import { Controller, UseGuards, Post, Req, Body, Get, Query, HttpCode, 
        HttpStatus, Param, BadRequestException, Res, Put 
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { AdminJWTAuthGuard } from 'src/admin-users/admin-jwt-auth.guard';
import { ResponseSuccess } from 'src/common/dto/response.dto';
import { IResponse } from 'src/common/interfaces/response.interface';
import { MongoIdValidationPipe } from 'src/common/pipes/parse-mongo-id';
import { UsersService } from 'src/users/users.service';
import { AdminGetPaymentDto } from './dto/admin-get-payment-paginate.dto';
import { AdminUpdateStatusDto } from './dto/admin-update-status.dto';
import { PaymentService } from './payment.service';
import { PaymentPaginateResponse } from './responses/payment-paginate.response';
import { PaymentItemResponse } from './responses/payment.response';


@ApiTags('admin')
@Controller('admin-payment')
export class AdminPaymentController {
    constructor(
        private readonly paymentService: PaymentService,
        private readonly userService: UsersService,
    ){}


    @Get()
    @ApiOkResponse({
        type: PaymentPaginateResponse
    })
    @ApiBearerAuth()
    @UseGuards(AdminJWTAuthGuard)
    async find( @Query() query: AdminGetPaymentDto ): Promise<IResponse>{
        const data = await this.paymentService.adminGetPaginate( query );
        return new ResponseSuccess( new PaymentPaginateResponse(data) );
    }
}
