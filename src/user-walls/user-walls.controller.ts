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
import { UsersService } from 'src/users/users.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { INotifyMessageBody } from 'src/firebase/firebase.service';

@ApiTags('user-walls')
@Controller('user-walls')
export class UserWallsController {
  constructor(
      private readonly userWallsService: UserWallsService,
      private readonly userService: UsersService,
      private readonly notifyService: NotificationsService,
    ) {}

  @ApiBearerAuth()
  @Post()
  @UseGuards(JwtAuthGuard)
  async create( @Req() request, @Body() createUserWallDto: CreateUserWallDto): Promise<IResponse> {
    const data = { ...createUserWallDto, user: request.user.id };
    const create = await this.userWallsService.create(data);
    return new ResponseSuccess( new UserWallsItemResponse( create ) );
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
      type: UserWallsResponse
  })
  async getWallByUserId( 
      @Param('userId', new MongoIdValidationPipe() ) userId: string,
      @Req() request, @Query() query: GetUserWallDto )
    : Promise<IResponse>{
    const d = await this.userWallsService.findWallByUser( userId, request, query);
    return new ResponseSuccess(new UserWallsResponse(d[0]));
  }

  @ApiOkResponse({ type: UserWallsItemResponse  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async get(
    @Req() request,
    @Param('id', new MongoIdValidationPipe() ) id: string): Promise<IResponse>{
    const find: UserWallEntityDocument = await this.userWallsService.findById(id);
    if( !find ) throw new BadRequestException('Not found');
    // update count view
    const updateView = {
        viewCount: find.viewCount + 1
    }
    await this.userWallsService.update( id, updateView );
    const findLiked = await this.userWallsService.findLikedWall(find, request.user.id);
    find.isLiked = findLiked ? true : false;
    return new ResponseSuccess(new UserWallsItemResponse(find));
  }


  @ApiOkResponse({ type: UserWallsItemResponse  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/share')
  async postShare(@Param('id', new MongoIdValidationPipe() ) id: string): Promise<IResponse>{
      const find: UserWallEntityDocument = await this.userWallsService.findById(id);
      if( !find ) throw new BadRequestException('Not found');
      // update share count
      const update = {
          shareCount: find.shareCount + 1
      }
      await this.userWallsService.update( id, update );
      return new ResponseSuccess(new UserWallsItemResponse(find));
  }

  @ApiOkResponse({ type: UserWallsItemResponse  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  async postLike(
      @Req() request,
      @Param('id', new MongoIdValidationPipe() ) id: string
    ): Promise<IResponse>{
      const post: UserWallEntityDocument = await this.userWallsService.findById(id);
      if( !post ) throw new BadRequestException('Post Not found');
      
      const data = await this.userWallsService.saveLike( post, request.user.id );
      const userLike = await this.userService.findById(request.user.id);

      const notifyData = {
        title: `${userLike.fullname} commented on your post`,
        body: post.caption !== '' ? post.caption.substring(0,10) : 'Tap to view',
        imageUrl: userLike.avatar,
        clickAction: 'VIEW_WALL_POST',
        metaData: {
          wallId: post.id.toString(),
          userId: post.user.id.toString(),
          userLikeId: request.user.id.toString()
        },
      } as INotifyMessageBody
  
      const fcmTokens = await this.userService.getUserFcmToken(post.user.id);
      this.notifyService.sendNotify(fcmTokens, notifyData, post.user.id );

      return new ResponseSuccess( { data: data } );
  }


  @ApiOkResponse({ type: UserWallsItemResponse })
  @ApiBody({ type: UpdateUserWallDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
        @Req() request, 
        @Param('id', new MongoIdValidationPipe() ) id: string,
        @Body() body: UpdateUserWallDto
      ): Promise<IResponse> {
      const find = await this.userWallsService.findById(id);
      if( !find ) throw new BadRequestException('Not found');

      if( request.user.id != find.user.id ){
        throw new BadRequestException('You do not have role to update');
      }

      delete body['createdAt'];
      const data = await this.userWallsService.update( id, {
        ...body,
        updatedAt: Date.now()
      });

      return new ResponseSuccess(new UserWallsItemResponse(data));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id', new MongoIdValidationPipe() ) id: string) {
    return await this.userWallsService.remove(id);
  }


}
