import { Controller, UseGuards, Post, Req, Body, Get, Query, HttpCode, 
        HttpStatus, Param, BadRequestException, Res, Put 
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { TransactionService } from './transaction.service';
import { TransactionItemResponse } from './responses/transaction.response';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { IResponse } from 'src/common/interfaces/response.interface';
import { ResponseSuccess } from 'src/common/dto/response.dto';
import { TransactionItemsResponse } from './responses/transactions.response';
import { GetTransactionDto } from './dto/get-transaction.dto';
import { MongoIdValidationPipe } from 'src/common/pipes/parse-mongo-id';
import { UsersService } from 'src/users/users.service';
import { CreateManyTransactionDto } from './dto/create-many-transaction.dto';
import { AdminJWTAuthGuard } from 'src/admin-users/admin-jwt-auth.guard';
import { AdminGetTransactionHistoryDto } from './dto/admin-get-transaction-history.dto';
import { PaymentItemResponse } from 'src/payment/responses/payment.response';
import { AdminUpdateStatusDto } from 'src/payment/dto/admin-update-status.dto';
import { PaymentStatus } from 'src/payment/schemas/payment.schema';
import { TransactionMethod } from './schemas/transaction.schema';
import { PaymentService } from 'src/payment/payment.service';


@ApiTags('admin')
@Controller('admin-transaction')
export class AdminTransactionController {
    constructor(
        private readonly transactionService: TransactionService,
        private readonly userService: UsersService,
        private readonly paymentService: PaymentService,
    ){}


    @Get()
    @ApiOkResponse({
        type: TransactionItemsResponse
    })
    @ApiBearerAuth()
    @UseGuards(AdminJWTAuthGuard)
    async find( @Query() query: AdminGetTransactionHistoryDto ): Promise<IResponse>{
        const data = await this.transactionService.adminGetAllTransaction( query );
        return new ResponseSuccess( new TransactionItemsResponse(data) );
    }


    @Get(':userId/balance')
    @HttpCode( HttpStatus.OK )
    @ApiBearerAuth()
    @UseGuards(AdminJWTAuthGuard)
    async getUserBlance( @Res() res, @Param('userId', new MongoIdValidationPipe() ) userId: string ): Promise<any> {
        const balance = await this.transactionService.getUserBlance(userId)
        return res.json({
            data: { balance: balance },
            code: 200,
            message: 'Successful'
        }) 
    }

    @ApiOkResponse({
        type: TransactionItemsResponse
    })
    @Post('give')
    @ApiBearerAuth()
    @UseGuards(AdminJWTAuthGuard)
    async systemGiveBlance(
        @Req() request,
        @Body() body: CreateManyTransactionDto
    ): Promise<IResponse>
    {
        const allUsers = await this.userService.find()
        const createMany = allUsers.map( (item ) => {
            return {
                user: item.id,
                rate: 1,
                quantity: body.quantity,
                total: body.quantity * 1,
                paymentMethod: 'system',
                status: 'success',
            }
        })
      
        const d = await this.transactionService.createMany(createMany);
        return new ResponseSuccess( (d));
    }

    @Put('payment/:id/update')
    @ApiOkResponse({
        type: PaymentItemResponse
    })
    @ApiBearerAuth()
    @UseGuards(AdminJWTAuthGuard)
    async update(
        @Param('id', new MongoIdValidationPipe() ) id: string,
        @Body() body: AdminUpdateStatusDto ): Promise<IResponse>{
            const paymentRequest = await this.paymentService.findById(id);
            if(!paymentRequest) throw new BadRequestException('Payment request not found');

            if( paymentRequest.status === PaymentStatus.COMPLETED ){
                throw new BadRequestException('Payment are completed');
            }

            const create = {
                user: paymentRequest.user,
                rate: 1,
                quantity: paymentRequest.diamondQty,
                total: paymentRequest.diamondQty,
                paymentMethod: TransactionMethod.TOPUP,
                status: 'success',
                referenceId: paymentRequest.id,
                info: 'Top-up'
            }
            // create trans
            const d = await this.transactionService.create(create);

            // upgrade user level
            await this.transactionService.upgradeLevelUser( paymentRequest.user );
            
            // update status
            const data = await this.paymentService.adminUpdateStatus( id, body );
            return new ResponseSuccess( new PaymentItemResponse(data) );
    }

    
}
