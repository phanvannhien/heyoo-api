import { Controller, UseGuards, Post, Req, Body, Get, Query, HttpCode, 
        HttpStatus, Param, BadRequestException, Res 
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { TransactionService } from './transaction.service';
import { TransactionItemResponse } from './responses/transaction.response';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { IResponse } from 'src/common/interfaces/response.interface';
import { ResponseError, ResponseSuccess } from 'src/common/dto/response.dto';
import { TransactionItemsResponse } from './responses/transactions.response';
import { GetTransactionDto } from './dto/get-transaction.dto';
import { MongoIdValidationPipe } from 'src/common/pipes/parse-mongo-id';
import { UsersService } from 'src/users/users.service';
import { CreateManyTransactionDto } from './dto/create-many-transaction.dto';
import { AdminJWTAuthGuard } from 'src/admin-users/admin-jwt-auth.guard';
import { SendDiamondDto } from './dto/send-diamond.dto';
import { CreatePaymentUrlDto } from './dto/create-payment-url.dto';
import { sortObject } from '../common/utils/vnpay';
import * as moment from 'moment';
import * as querystring from 'qs';
import * as crypto from 'crypto';
import { PackageService } from 'src/packages/package.service';
import { PaymentService } from 'src/payment/payment.service';
import { CreatePaymentDto } from 'src/payment/dto/create-payment.dto';
import { PaymentStatus } from 'src/payment/schemas/payment.schema';
import { CreateCompletedTransactionDto } from './dto/create-completed-transaction.dto';
import { GetTransactionHistoryDto } from './dto/get-transaction-history.dto';
import { TransactionMethod } from './schemas/transaction.schema';
import { ConfigurationService } from 'src/configuration/configuration.service';
import { WalletsService } from 'src/wallets/wallets.service';


@ApiTags('transaction')
@Controller('transaction')
export class TransactionController {
    constructor(
        private readonly transactionService: TransactionService,
        private readonly userService: UsersService,
        private readonly packageService: PackageService,
        private readonly paymentService: PaymentService,
        private readonly configService: ConfigurationService,
        private readonly walletService: WalletsService
    ){}

    @Get('history')
    @HttpCode( HttpStatus.OK )
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async getPaymentHistory( @Req() request, @Query() query: GetTransactionHistoryDto ): Promise<any> {
        const data = await this.transactionService.findHistory( request.user.id, query );
        return new ResponseSuccess( new TransactionItemsResponse(data) );
    }


    // @ApiBearerAuth()
    // @ApiOkResponse({
    //     type: TransactionItemResponse
    // })
    // @UseGuards(JwtAuthGuard)
    // @Post()
    // async create(
    //     @Req() request,
    //     @Body() body: CreateTransactionDto
    // ): Promise<IResponse>
    // {
    //     try{
    //         const create = {
    //             user: request.user.id,
    //             rate: 1,
    //             quantity: body.quantity,
    //             total: body.quantity * 1,
    //             paymentMethod: body.paymentMethod,
    //             status: 'success',
    //         }
    //         const d = await this.transactionService.create(create);
    //         await this.transactionService.upgradeLevelUser( request.user.id );
    //         return new ResponseSuccess( new TransactionItemResponse(d));

    //     }catch(e){

    //     }   
    // }


    @Get(':userId/balance')
    @HttpCode( HttpStatus.OK )
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async getUserBlance( @Res() res, @Param('userId', new MongoIdValidationPipe() ) userId: string ): Promise<any> {

        const balance = await this.transactionService.getUserBlance(userId); // All send, topup, received, buy items
        const donate = await this.walletService.getTotalDonate(userId);
        const withDraw = await this.userService.getTotalWithDrawOnRequest(userId); 
        const diamondRate = await this.configService.getDiamondToVNDRate(); // rate VND => Dinamond
        
        const donateDiamond = donate[0]?.total ?? 0;
        const withDrawDiamond = withDraw[0]?.total ?? 0;

        const diamond = Number(donateDiamond - withDrawDiamond) * Number(diamondRate.configValue);

        return res.json({
            data: { 
                balance: balance,
                donate: donateDiamond,
                withDraw: withDrawDiamond,
                remain: donateDiamond - withDrawDiamond,
                diamond: diamond
            },
            code: 200,
            message: 'Successful'
        }) 
    }


    @ApiBearerAuth()
    @ApiOkResponse()
    @UseGuards(JwtAuthGuard)
    @Post('send-diamond')
    async sendDiamondToUser(
        @Req() request,
        @Body() body: SendDiamondDto
    ): Promise<IResponse>
    {
        const fromUser = await this.userService.findById(request.user.id);
        const user = await this.userService.findById(body.toUserId);
        if(!user)  throw new BadRequestException("User not found");
        try{
            // received
            const create = {
                referenceId: request.user.id,
                user: body.toUserId,
                rate: 1,
                quantity: body.quantity,
                total: body.quantity,
                paymentMethod: TransactionMethod.RECEIVED ,
                status: 'success',
                info: 'Received Diamond from '+ fromUser.fullname
            };
            const d = await this.transactionService.create(create);

            // send
            const send = {
                referenceId: body.toUserId,
                user: request.user.id,
                rate: 1,
                quantity: -body.quantity,
                total: -body.quantity,
                paymentMethod: TransactionMethod.SEND,
                status: 'success',
                info: 'Transferred Diamond to '+ user.fullname 
            };
            await this.transactionService.create(send);

            return new ResponseSuccess( new TransactionItemResponse(d));
        }catch(e){
            throw new BadRequestException("Fail")
        }
        
    }


    @Post('create-payment-url')
    @HttpCode( HttpStatus.OK )
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async startPayment(  @Req() request, @Body() body: CreatePaymentUrlDto ): Promise<any> {
       
        const packagePayment = await this.packageService.findById(body.packageId);
        if(!packagePayment) throw new BadRequestException('Package not found');

        const orderInfo = 'Payment '+ packagePayment.name ;
        // create payment request
        const paymentRequest = await this.paymentService.create({
            orderInfo: orderInfo,
            user: request.user.id,
            price: packagePayment.price,
            diamondQty: packagePayment.quantity,
            status: PaymentStatus.PROCESSING
        } as CreatePaymentDto)

        const ipAddr = '192.168.15.102';
        const tmnCode = process.env.vnp_TmnCode;
        const secretKey = process.env.vnp_HashSecret;
        let vnpUrl = process.env.vnp_Url;
        const returnUrl =  process.env.APP_URL;

        // var createDate = moment().utc().format('yyyymmddHHmmss');
        const createDate = moment().utc().format('YYYYMMDDHHmmss');
        const amount = packagePayment.price;
       
        const orderType = 'billpayment';
        let locale = body.language;
        
        if( locale.toString() !== null || locale.toString() === 'vi'){
            locale = 'vn';
        }

        const currCode = 'VND';
        let vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        // vnp_Params['vnp_Merchant'] = ''
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = paymentRequest.id;
        vnp_Params['vnp_OrderInfo'] = orderInfo;
        vnp_Params['vnp_OrderType'] = orderType;
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        
        vnp_Params = sortObject(vnp_Params);

        const signData = querystring.stringify(vnp_Params, { encode: false });
        const hmac = crypto.createHmac("sha512", secretKey);
        const signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex"); 
        
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

        return new ResponseSuccess({
            url: vnpUrl
        })

    }

    @Post('completed')
    @HttpCode( HttpStatus.OK )
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async completed(
        @Req() request,
        @Body() body: CreateCompletedTransactionDto
    ){
    
        const paymentRequest = await this.paymentService.findById(body.orderId);
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
        await this.transactionService.upgradeLevelUser( request.user.id );

        // update trans
        await this.paymentService.updateStatus(body.orderId,  PaymentStatus.COMPLETED );

        return new ResponseSuccess( new TransactionItemResponse(d));

        
    }

}
