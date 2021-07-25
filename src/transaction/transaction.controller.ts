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


@ApiTags('transaction')
@Controller('transaction')
export class TransactionController {
    constructor(
        private readonly transactionService: TransactionService,
        private readonly userService: UsersService,
       
    ){}

    @ApiBearerAuth()
    @ApiOkResponse({
        type: TransactionItemResponse
    })
    @UseGuards(JwtAuthGuard)
    @Post()
    async create(
        @Req() request,
        @Body() body: CreateTransactionDto
    ): Promise<IResponse>
    {
        try{
            const create = {
                user: request.user.id,
                rate: 1,
                quantity: body.quantity,
                total: body.quantity * 1,
                paymentMethod: body.paymentMethod,
                status: 'success',
            }
            const d = await this.transactionService.create(create);
            
            await this.transactionService.upgradeLevelUser( request.user.id );

            return new ResponseSuccess( new TransactionItemResponse(d));

        }catch(e){

        }
        
    }




    @Get()
    @ApiOkResponse({
        type: TransactionItemsResponse
    })
    async find( @Query() query: GetTransactionDto ): Promise<IResponse>{
        const d = await this.transactionService.findAll(query);
        return new ResponseSuccess(new TransactionItemsResponse(d));
    }


    @Get(':userId/balance')
    @HttpCode( HttpStatus.OK )
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
