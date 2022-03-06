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
import { AdminGetUserWallCommentDto } from './dto/admin-get-user-wall-comment.dto';
import { UserWallCommentService } from './user-wall-comments.service';
import { UserWallCommentPaginateResponse } from './responses/user-walls-comment-paginate.response';
import { AdminUserWallCommentPaginateResponse } from './responses/admin-user-walls-comment-paginate.response';
import * as mongoose from 'mongoose';
import { NotificationsService } from 'src/notifications/notifications.service';
import { UsersService } from 'src/users/users.service';
import { INotifyMessageBody } from 'src/firebase/firebase.service';

@ApiTags('admin')
@Controller('admin-user-walls')
export class AdminUserWallsController {
  constructor(
      private readonly userWallsService: UserWallsService,
      private readonly userWallCommentService: UserWallCommentService,
      private readonly notifyService: NotificationsService,
      private readonly userService: UsersService,
    ) {}

 
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
        $lookup: {
          from: 'user_wall_comments',
          let: { wallId: "$_id" },
          pipeline: [
            {
              $match: { 
                $expr: {
                  $eq: ['$wall', '$$wallId' ]
                }
              }
            },
            {
              $lookup: {
                from: 'users',
                localField: "user",
                foreignField: "_id",
                as: "user"
              }
            },
            { $sort: { "_id": -1 } },
       
            {
              $unwind: {  path: "$user" }
            },
            {
              $facet: {
                latest: [{ $limit:1 }],
                total: [
                  {
                    $count: 'count'
                  }
                ]
              }
            }
          ],
          as: 'comments'
        }
      },

      {
        $unwind: {  path: "$comments", preserveNullAndEmptyArrays: true }
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
    const post = await this.userWallsService.findById(id);
    const notifyData = {
      title: `System notification`,
      body: `A post you published on ${new Date(post.createdAt).getTime().toString()} was removed because it violated our Community Guidelines. 
      Please check these guidelines for more details`,
      imageUrl: 'https://d21y6rmzuyq1qt.cloudfront.net/27a2ff52-6ae1-49e3-bde6-6427b661588f',
      clickAction: 'VIEW_PRIVACY_POLICY',
      metaData: {
        postWallId: id.toString()
      },
    } as INotifyMessageBody

    const fcmTokens = await this.userService.getUserFcmToken( post.user.id);
    this.notifyService.sendNotify(fcmTokens, notifyData, post.user.id );
    return await this.userWallsService.delete(id);
  }

  @ApiBearerAuth()
  @UseGuards(AdminJWTAuthGuard)
  @Delete('post/reset-like-count')
  async resetAllLikePost() {
    return await this.userWallsService.resetAllLikeCount();
  }


  @Get('comments')
  @ApiBearerAuth()
  @UseGuards(AdminJWTAuthGuard)
  @ApiOkResponse({
      type: UserWallsPaginationResponse
  })
  async getAllComments( @Req() request, @Query() query: AdminGetUserWallCommentDto ): Promise<IResponse>{
    
    let queryData = [
      { $match: query.comment ? { comment: { $regex: new RegExp( query.comment ) } } : {}  },
      { $match: query.wallId ? { wall:  new mongoose.Types.ObjectId( query.wallId )   } : {}  },
      { $match: query.createdAt ? {createdAt : new Date ( query.createdAt )} : {} },
      {
        $lookup:
          {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user"
          }
      },
      {
        $unwind: {  path: "$user", preserveNullAndEmptyArrays: true }
      },
      {
        $lookup:
          {
            from: "user_walls",
            localField: "wall",
            foreignField: "_id",
            as: "wall"
          }
      },
      {
        $unwind: {  path: "$wall", preserveNullAndEmptyArrays: true }
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
      },
      {
        $unwind: {  path: "$total"}
      },

    ];

    const d = await this.userWallCommentService.findAll(queryData);
    return new ResponseSuccess(new AdminUserWallCommentPaginateResponse(  d[0] ));
  }


  @ApiBearerAuth()
  @UseGuards(AdminJWTAuthGuard)
  @Delete('comments/:id')
  async delete(@Param('id', new MongoIdValidationPipe() ) id: string) {
    return await this.userWallCommentService.remove(id);
  }

}
