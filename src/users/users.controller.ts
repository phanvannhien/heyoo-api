import { Controller, Get, Res, HttpCode, Param, BadRequestException, HttpStatus, Delete, Query, UseGuards, Req, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service'
import { ApiResponse, ApiTags, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { IResponse } from 'src/common/interfaces/response.interface';
import { ResponseSuccess } from 'src/common/dto/response.dto';
import { MongoIdValidationPipe } from 'src/common/pipes/parse-mongo-id';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FollowResponse } from './responses/follow.response';
import { FollowsResponse } from './responses/follows.response';
import { GetFollowerDto } from './dto/getfollower.dto';
import { GetFollowingDto } from './dto/getfollowing.dto';
import { UserProfileResponse } from 'src/auth/responses/profile.response';
import { RegisterFcmTokenDto } from './dto/register-fcmtoken.dto';
import { GetUserDto } from './dto/get-users.dto';
import { UsersResponse } from './responses/users.response';
import { CreateWithDrawDto } from './dto/withdraw.dto';
import { WalletsService } from 'src/wallets/wallets.service';
import { WithDrawStatus } from './schemas/withdraw.schema';
import { WithDrawItemResponse } from './responses/withdraw.response';
import { GetWithDrawDto } from './dto/get-withdraw.dto';
import { WithDrawPaginateResponse } from './responses/withdraw-paginate.response';


@ApiTags('users')
@Controller('users')
export class UsersController {

    constructor( 
        private userService: UsersService,
        private walletService: WalletsService
    ){}


    @ApiResponse({ type: UserProfileResponse })
    @Get(':id')
    @ApiBearerAuth()
    @UseGuards( JwtAuthGuard )
    @HttpCode( HttpStatus.OK )
    async getCustomer( @Param('id', new MongoIdValidationPipe() ) id: string ): Promise<IResponse> {
        const user = await this.userService.getProfile(id);
        if( user.length <= 0 ){
            throw new BadRequestException('User not found')
        }

        return new ResponseSuccess( new UserProfileResponse(user[0]) )
    }


    @ApiOkResponse()
    @ApiBearerAuth()
    @Post('do/register-fcm-token')
    @HttpCode( HttpStatus.OK )
    @UseGuards(JwtAuthGuard)
    async registerFcmToken( @Req() request, @Body() body: RegisterFcmTokenDto ): Promise<IResponse> {

        const data = await this.userService.registerFcmToken(request.user.id, body );
        return new ResponseSuccess( { fcmToken: data.fcmToken } )
    }

    @ApiResponse({
        type: FollowResponse
    })
    @ApiBearerAuth()
    @Post(':userId/dofollow')
    @HttpCode( HttpStatus.OK )
    @UseGuards(JwtAuthGuard)
    async doFollow( @Req() request, @Param('userId', new MongoIdValidationPipe() ) userId: string ): Promise<IResponse> {
        const find = await this.userService.findById(userId);
        if (!find) throw new BadRequestException('User not found');
        const follow = await this.userService.doFollow(request.user.id, userId);
        return new ResponseSuccess( new FollowResponse(follow) )
    }

    @ApiOkResponse()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post(':userId/unfollow')
    @HttpCode( HttpStatus.OK )
    async unFollow( @Req() request, @Param('userId', new MongoIdValidationPipe() ) userId: string ): Promise<any> {
        const d = await this.userService.unFollow(request.user.id, userId);
        return new ResponseSuccess( d )
    }


    @ApiResponse({
        type: FollowsResponse
    })
    @Get(':userId/follower')
    @HttpCode( HttpStatus.OK )
    @UseGuards(JwtAuthGuard)
    async followers( 
        @Param('userId', new MongoIdValidationPipe() ) userId: string, 
        @Query() requestBody: GetFollowerDto 
    ): Promise<any> {
        const d = await this.userService.getFollower(userId, requestBody);
        return new ResponseSuccess( new FollowsResponse(d) )
    }

    @ApiOkResponse()
    @Get(':userId/following')
    @UseGuards(JwtAuthGuard)
    @HttpCode( HttpStatus.OK )
    async following( 
        @Param('userId', new MongoIdValidationPipe() ) userId: string, 
        @Query() requestBody: GetFollowingDto 
    ): Promise<any> {
        const d = await this.userService.getFollowing(userId, requestBody);
        return new ResponseSuccess( new FollowsResponse(d) )
    }

    @ApiOkResponse()
    @ApiBearerAuth()
    @Get(':userId/is-following')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async checkIsFollowing( 
        @Req() request,
        @Param('userId', new MongoIdValidationPipe() ) userId: string
    ): Promise<any> {
        const d = await this.userService.checkIsFollowing(request.user.id, userId )
        if( d ){
            return new ResponseSuccess({ isFollowing: true }) 
        }
        return new ResponseSuccess({ isFollowing: false }) 
    }

    @Get()
    @HttpCode(HttpStatus.OK )
    @ApiBearerAuth()
    @UseGuards( JwtAuthGuard )
    async getAll( @Query() queryParams: GetUserDto ): Promise<any>{
        const data = await this.userService.findPaginate(queryParams);
        return new ResponseSuccess(  new UsersResponse(data) );
    }

    @ApiOkResponse({
        type: WithDrawItemResponse
    })
    @ApiBearerAuth()
    @Post('do/request-withdraw')
    @HttpCode( HttpStatus.OK )
    @UseGuards(JwtAuthGuard)
    async withdraw( @Req() request, @Body() body: CreateWithDrawDto ): Promise<IResponse> {

        const user = await this.userService.findById(request.user.id);

        const totalDonate = await this.walletService.getTotalDonate( request.user.id );
        const totalWithDraw = await this.userService.getTotalWithDraw(request.user.id);

        const numberTotalDonate = totalDonate.length > 0 ? totalDonate[0]['total'] : 0;
        const numberTotalWithDraw = totalWithDraw.length > 0 ? totalWithDraw[0]['total']: 0;

        if( numberTotalWithDraw + body.quantity > numberTotalDonate ){
            throw new BadRequestException( 'Over allowed to withdraw' );
        }

        const data = await this.userService.createWithDraw({
            total: body.quantity,
            quantity: body.quantity,
            info: `${user.fullname } make request withdraw ${body.quantity}`,
            status: WithDrawStatus.PROCESSING,
            user: request.user.id
        });
        return new ResponseSuccess( new WithDrawItemResponse(data) )
    }

    @ApiOkResponse({
        type: WithDrawPaginateResponse
    })
    @ApiBearerAuth()
    @Get('do/withdraw')
    @HttpCode( HttpStatus.OK )
    @UseGuards(JwtAuthGuard)
    async getWithDrawHistory( @Req() request, @Query() query: GetWithDrawDto ): Promise<IResponse> {
        const data = await this.userService.getWithDrawHistory(request.user.id, query);
        return new ResponseSuccess( new WithDrawPaginateResponse(data) )
    }


}
