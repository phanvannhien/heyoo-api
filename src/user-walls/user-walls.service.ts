import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { USER_WALL_MODEL, USER_WALL_LIKE_MODEL } from 'src/mongo-model.constance';
import { CreateUserWallDto } from './dto/create-user-wall.dto';
import { UpdateUserWallDto } from './dto/update-user-wall.dto';
import { UserWallEntityLikeDocument } from './entities/user-wall-likes.entity';
import { UserWallEntityDocument } from './entities/user-wall.entity';
import * as mongoose from 'mongoose';
import { GetUserWallDto } from './dto/get-userwall.dto';

@Injectable()
export class UserWallsService {
  constructor(
    @InjectModel( USER_WALL_MODEL ) private readonly userWallModel,
    @InjectModel( USER_WALL_LIKE_MODEL ) private readonly userWallLikeModel: Model<UserWallEntityLikeDocument>,
  ){}

  async create(createUserWallDto: CreateUserWallDto): Promise<UserWallEntityDocument> {
    const item = new this.userWallModel(createUserWallDto);
    return await item.save();
  }

  async findAll( queryData ): Promise<UserWallEntityDocument[]>{
   
    return await this.userWallModel.aggregate(queryData).exec();

  }

  async findWallByUser( userId : string, request, query): Promise<UserWallEntityDocument[]>{
    return await this.userWallModel.aggregate([
      {
        $match: { user: new mongoose.Types.ObjectId( userId ) }
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
            { $sort: { "_id": -1 } },
            {
              $lookup: {
                from: 'users',
                localField: "user",
                foreignField: "_id",
                as: "user"
              }
            },
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
        $lookup: {
          from: 'user_wall_likes',
          let: { 
            userId: Types.ObjectId( request.user.id ),
            postId: "$_id"
          },
          pipeline: [
            {
              $match: { 
                
                $expr: {
                  
                  $and: [
                    { $eq: ['$userLike', '$$userId' ] },
                    { $eq: ["$userWall", "$$postId" ] },
                  ]
                  
                }
              }
            },
            {
              $project: {
                _id: 1,
                userLike: 1,
                userWall: 1,

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
      // { $unwind: { path : "$likes" } },
      { $sort: { "_id": -1 } },
      { $limit: Number(query.limit) },
      { $skip:  Number(query.limit) * (Number(query.page) - 1) }
    ]).exec();

  }

  async findById(id: string): Promise<UserWallEntityDocument> {

    return await this.userWallModel.findById(id).exec();
  }

  async update(id: string, object): Promise<UserWallEntityDocument> {
    return await this.userWallModel.findByIdAndUpdate(id, object);
  }

  async endWallLive( liveStreamId: string ): Promise<any>{
    return await this.userWallModel.findOneAndUpdate({
      liveStreamId: liveStreamId
    }, {
      liveStreamStatus: false
    });
  }

  async remove(id: string): Promise<UserWallEntityDocument> {
    return await this.userWallModel.findByIdAndDelete(id);
  }

  async delete(id: string): Promise<any> {
    return await this.userWallModel.deleteById(id);
  }

  async saveLike( post: UserWallEntityDocument , userId: string ): Promise<boolean>{
    const data = {
      userWall: post.id, 
      userLike: userId
    };
    let updateData = {};
    
    const liked = await this.userWallLikeModel.findOne(data).exec();
    if(liked){
      await this.userWallLikeModel.deleteOne(data).exec();
      updateData = {
        likeCount: post.likeCount - 1
      }
      await this.userWallModel.findByIdAndUpdate( post.id, updateData );
      return false;
    }else{
      updateData = {
        likeCount: post.likeCount + 1
      }
      await this.userWallModel.findByIdAndUpdate( post.id, updateData );
      const item = new this.userWallLikeModel(data);
      await item.save();
      return true;
    }
  }

  async findLikedWall(userWall: UserWallEntityDocument , userId: string): Promise<UserWallEntityLikeDocument> {
    return await this.userWallLikeModel.findOne({
      userWall: userWall.id, 
      userLike: userId
    }).exec()
  }

  async resetAllLikeCount(): Promise<any> {
    await this.userWallModel.updateMany({},{
      likeCount: 0
    });
    return await this.userWallLikeModel.remove();
  }
}
