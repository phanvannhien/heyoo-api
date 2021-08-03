import { Controller, UseGuards, Post, Req, Body, Get, Query, HttpCode, 
        HttpStatus, Param, BadRequestException, Res 
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


@ApiTags('admin')
@Controller('admin-transaction')
export class AdminTransactionController {
    constructor(
        private readonly transactionService: TransactionService,
        private readonly userService: UsersService,
       
    ){}


    @Get()
    @ApiOkResponse({
        type: TransactionItemsResponse
    })
    @ApiBearerAuth()
    @UseGuards(AdminJWTAuthGuard)
    async find( @Query() query: GetTransactionDto ): Promise<IResponse>{
        const d = await this.transactionService.findAll(query);
        return new ResponseSuccess(new TransactionItemsResponse(d));
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

}
