import { Controller, 
  Get, Post, Body, Patch, 
  Param, Delete, UseGuards, 
  Req, Query, BadRequestException, 
  Put } from '@nestjs/common';
import { UserWallsService } from './user-walls.service';
import { CreateUserWallDto } from './dto/create-user-wall.dto';
import { UpdateUserWallDto } from './dto/update-user-wall.dto';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { IResponse } from 'src/common/interfaces/response.interface';
import { UserWallsItemResponse } from './responses/userwalls.response';
import { ResponseSuccess } from 'src/common/dto/response.dto';
import { UserWallsResponse } from './responses/userwalls-paginate.response';
import { GetWalletsDto } from 'src/wallets/dto/get-wallets.dto';
import { GetUserWallDto } from './dto/get-userwall.dto';
import { MongoIdValidationPipe } from 'src/common/pipes/parse-mongo-id';
import { UserWallEntityDocument } from './entities/user-wall.entity';
import { UserWallsPaginationResponse } from './responses/userwalls-pagination.response';
import { AdminJWTAuthGuard } from 'src/admin-users/admin-jwt-auth.guard';

@ApiTags('admin')
@Controller('admin-user-walls')
export class AdminUserWallsController {
  constructor(private readonly userWallsService: UserWallsService) {}

 
 
  @Get()
  @ApiBearerAuth()
  @UseGuards(AdminJWTAuthGuard)
  @ApiOkResponse({
      type: UserWallsPaginationResponse
  })
  async find( @Req() request, @Query() query: GetUserWallDto ): Promise<IResponse>{
    
    let queryData = [
      { $match:  query.caption ? { caption: { $regex: new RegExp( query.caption ) } } : {}  },
      {
        $lookup: {
          from: 'user_wall_likes',
          let: { userId: "user" },
          pipeline: [
            {
              $match: { 
                $expr: {
                    $eq: ['$userLike', '$$userId' ]
                }
              }
            },
            {
              $project: {
                _id: 1,
                userLike: 1
              }
            },
            { $limit: 1 }
          ],
          as: 'likes'
        },

      },
      {
        $addFields: {
          isLiked: { 
              $cond: {
                if: {$gt: [{$size: "$likes"}, 0 ]} , then: true, else: false 
              }
          }
        }
      },
      { $sort: { "_id": -1 } },
      {
        $facet: {
          items: [{ $skip: Number(query.limit) * (Number(query.page) - 1) }, { $limit: Number(query.limit) }],
          total: [
            {
              $count: 'count'
            }
          ]
        }
      }
     
    ];
  
    const d = await this.userWallsService.findAll(queryData);
    return new ResponseSuccess(new UserWallsPaginationResponse(  d[0] ));
  }

  @Get(':userId/walls')
  @ApiBearerAuth()
  @UseGuards(AdminJWTAuthGuard)
  @ApiOkResponse({
      type: UserWallsResponse
  })
  async getWallByUserId( 
      @Param('userId', new MongoIdValidationPipe() ) userId: string,
      @Req() request, @Query() query: GetUserWallDto )
    : Promise<IResponse>{
    const d = await this.userWallsService.findWallByUser( userId, request, query);
    return new ResponseSuccess(new UserWallsResponse(d));
  }


  @ApiBearerAuth()
  @UseGuards(AdminJWTAuthGuard)
  @Delete(':id')
  async remove(@Param('id', new MongoIdValidationPipe() ) id: string) {
    return await this.userWallsService.remove(id);
  }

  @ApiBearerAuth()
  @UseGuards(AdminJWTAuthGuard)
  @Delete('post/reset-like-count')
  async resetAllLikePost() {
    return await this.userWallsService.resetAllLikeCount();
  }

}
