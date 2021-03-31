import { Controller, Get, Res, HttpCode, Param, BadRequestException, HttpStatus, Delete, Query, UseGuards, Req, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service'
import { ApiResponse, ApiTags, ApiCookieAuth, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserResponse } from './responses/user.response';
import { IResponse } from 'src/common/interfaces/response.interface';
import { ResponseSuccess } from 'src/common/dto/response.dto';
import { FindIdUserDto } from './dto/find-id.dto';
import { GetUserDto } from './dto/get-users.dto';
import { MongoIdValidationPipe } from 'src/common/pipes/parse-mongo-id';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { request } from 'http';
import { FollowResponse } from './responses/follow.response';
import { FollowsResponse } from './responses/follows.response';
import { GetFollowerDto } from './dto/get-\bfollower.dto';
import { GetFollowingDto } from './dto/get-\bfollowing.dto';


@ApiTags('users')
@Controller('users')
export class UsersController {

    constructor( 
        private userService: UsersService,
    ){}

    @Get()
    @HttpCode(HttpStatus.OK )
    async getAll( @Res() res, @Query() queryParams: GetUserDto ){
        const data = await this.userService.findAll(queryParams);
        return res.json( {
            data: { 
                items: data,
                total: data.length
            }
        });
    }

    @ApiResponse({ type: UserResponse })
    @Get(':id')
    @HttpCode( HttpStatus.OK )
    async getCustomer( @Param('id', new MongoIdValidationPipe() ) id: string ): Promise<IResponse> {
        const find = await this.userService.findById(id);
        if (!find) throw new BadRequestException('User not found');
        return new ResponseSuccess( new UserResponse(find) )
    }


    @Delete(':id')
    @HttpCode( HttpStatus.OK )
    async deleteCustomer(@Res() res, @Param() params: FindIdUserDto) {
        const customer = await this.userService.delete( params.id )
        if (!customer) throw new BadRequestException('User does not exist')
        return res.json({
            success: true
        })
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
    @Post(':userId/unfollow')
    @HttpCode( HttpStatus.OK )
    @UseGuards(JwtAuthGuard)
    async unFollow( @Req() request, @Param('userId', new MongoIdValidationPipe() ) userId: string ): Promise<any> {
        const d = await this.userService.unFollow(request.user.id, userId);
        return new ResponseSuccess( d )
    }


    @ApiResponse({
        type: FollowsResponse
    })
    @Get(':userId/follower')
    @HttpCode( HttpStatus.OK )
    async followers( 
        @Param('userId', new MongoIdValidationPipe() ) userId: string, 
        @Query() requestBody: GetFollowerDto 
    ): Promise<any> {
        const d = await this.userService.getFollower(userId, requestBody);
        return new ResponseSuccess( new FollowsResponse(d) )
    }

    @ApiOkResponse()
    @Get(':userId/following')
    @HttpCode( HttpStatus.OK )
    async following( 
        @Param('userId', new MongoIdValidationPipe() ) userId: string, 
        @Query() requestBody: GetFollowingDto 
    ): Promise<any> {
        const d = await this.userService.getFollowing(userId, requestBody);
        return new ResponseSuccess( new FollowsResponse(d) )
    }



}
