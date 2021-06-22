import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { USER_WALL_MODEL, USER_WALL_LIKE_MODEL } from 'src/mongo-model.constance';
import { CreateUserWallDto } from './dto/create-user-wall.dto';
import { UpdateUserWallDto } from './dto/update-user-wall.dto';
import { UserWallEntityLikeDocument } from './entities/user-wall-likes.entity';
import { UserWallEntityDocument } from './entities/user-wall.entity';
import * as mongoose from 'mongoose';

@Injectable()
export class UserWallsService {
  constructor(
    @InjectModel( USER_WALL_MODEL ) private readonly userWallModel: Model<UserWallEntityDocument>,
    @InjectModel( USER_WALL_LIKE_MODEL ) private readonly userWallLikeModel: Model<UserWallEntityLikeDocument>,
  ){}

  async create(createUserWallDto: CreateUserWallDto): Promise<UserWallEntityDocument> {
    const item = new this.userWallModel(createUserWallDto);
    return await item.save();
  }

  async findAll( request, query): Promise<UserWallEntityDocument[]>{

    return await this.userWallModel.aggregate([
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
      { $sort: { "createdAt": -1 } },
      { $limit: Number(query.limit) },
      { $skip:  Number(query.limit) * (Number(query.page) - 1) }
    ]).exec();

  }

  async findWallByUser( userId : string, request, query): Promise<UserWallEntityDocument[]>{

    return await this.userWallModel.aggregate([
      {
        $match: { user: new mongoose.Types.ObjectId( userId ) }
      },
      {
        $lookup: {
          from: 'user_wall_likes',
          let: { userId: Types.ObjectId( userId ) },
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
      { $sort: { "createdAt": -1 } },
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

  async remove(id: string): Promise<UserWallEntityDocument> {
    return await this.userWallModel.findByIdAndDelete(id);
  }

  async saveLike( userWall: UserWallEntityDocument , userId: string ): Promise<UserWallEntityDocument>{
    const data = {
      userWall: userWall.id, 
      userLike: userId
    };
    let updateData = {};
    
    const liked = await this.userWallLikeModel.findOne(data).exec();
    if(liked){
      await this.userWallLikeModel.deleteOne(data).exec();
      updateData = {
        likeCount: userWall.likeCount - 1
      }
    }else{
      updateData = {
        likeCount: userWall.likeCount + 1
      }
      const item = new this.userWallLikeModel(data);
      await item.save();
    }
    return await this.userWallModel.findByIdAndUpdate( userWall.id, updateData );
    
  }

  async findLikedWall(userWall: UserWallEntityDocument , userId: string): Promise<UserWallEntityLikeDocument> {
    return await this.userWallLikeModel.findOne({
      userWall: userWall.id, 
      userLike: userId
    }).exec()
  }
}
