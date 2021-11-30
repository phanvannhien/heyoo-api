import { Controller, Get, Res, HttpCode, Param, BadRequestException, HttpStatus, Delete, Query, UseGuards, Req, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service'
import { ApiResponse, ApiTags, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserResponse } from './responses/user.response';
import { IResponse } from 'src/common/interfaces/response.interface';
import { ResponseSuccess } from 'src/common/dto/response.dto';
import { FindIdUserDto } from './dto/find-id.dto';
import { GetUserDto } from './dto/get-users.dto';
import { MongoIdValidationPipe } from 'src/common/pipes/parse-mongo-id';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FollowResponse } from './responses/follow.response';
import { FollowsResponse } from './responses/follows.response';
import { GetFollowerDto } from './dto/getfollower.dto';
import { GetFollowingDto } from './dto/getfollowing.dto';
import { UserProfileResponse } from 'src/auth/responses/profile.response';
import { RegisterFcmTokenDto } from './dto/register-fcmtoken.dto';
import { AdminJWTAuthGuard } from 'src/admin-users/admin-jwt-auth.guard';
import { FirebaseDBService } from 'src/firebase/firebase-db.service';


@ApiTags('admin')
@Controller('admin-members')
export class AdminUsersFrontController {

    constructor( 
        private userService: UsersService,
        private firebaseDBService: FirebaseDBService,
    ){}

    @Get()
    @HttpCode(HttpStatus.OK )
    @ApiBearerAuth()
    @UseGuards( AdminJWTAuthGuard )
    async getAll( @Res() res, @Query() queryParams: GetUserDto ){
        const data = await this.userService.findPaginate(queryParams);
        return res.json( {
            data: { 
                items: data[0].items,
                total: data[0].total[0]?.count
            }
        });
    }

    @ApiResponse({ type: UserProfileResponse })
    @Get(':id')
    @ApiBearerAuth()
    @UseGuards( AdminJWTAuthGuard )
    @HttpCode( HttpStatus.OK )
    async getCustomer( @Param('id', new MongoIdValidationPipe() ) id: string ): Promise<IResponse> {
        const user = await this.userService.getProfile(id);
        if( user.length <= 0 ){
            throw new BadRequestException('User not found')
        }

        return new ResponseSuccess( new UserProfileResponse(user[0]) )
    }


    @Delete(':id')
    @HttpCode( HttpStatus.OK )
    @ApiBearerAuth()
    @UseGuards( AdminJWTAuthGuard )
    async deleteCustomer(@Res() res, @Param() params: FindIdUserDto) {
        const customer = await this.userService.delete( params.id )
        if (!customer) throw new BadRequestException('User does not exist')
        return res.json({
            success: true
        })
    }


    @Get('do/fcm-token-follower')
    @ApiOkResponse()
    @ApiBearerAuth()
    @UseGuards(AdminJWTAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getFcmToken(  @Req() request ): Promise<any>{
        return await this.userService.getUserFollowerFcmToken( request.user.id );
    }


    @Get('do/get-user-fcmtokens')
    @ApiOkResponse()
    @ApiBearerAuth()
    @UseGuards(AdminJWTAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getUserFcmTokens( @Req() request ): Promise<any>{
        return await this.userService.getUserFcmToken( request.user.id );
    }


    @Post('do/migrate-user-firebase')
    @ApiOkResponse()
    @ApiBearerAuth()
    @UseGuards(AdminJWTAuthGuard)
    @HttpCode(HttpStatus.OK)
    async migrateUserDBFirebase(): Promise<any>{
        const allUser = await this.userService.find();
        allUser.forEach( user => {
            this.firebaseDBService.saveUser(user);
        })
        return { message: 'Success' }
    }
    

}
