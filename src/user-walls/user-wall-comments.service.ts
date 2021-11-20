import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { USER_WALL_COMMENT_MODEL } from 'src/mongo-model.constance';
import * as mongoose from 'mongoose';
import { UserWallCommentEntityDocument } from './entities/user-wall-comment.entity';
import { CreateUserWallCommentDto } from './dto/create-user-wall-comment.dto';
import { GetUserWallCommentDto } from './dto/get-user-wall-comment.dto';


@Injectable()
export class UserWallCommentService {
  constructor(
    @InjectModel( USER_WALL_COMMENT_MODEL ) private readonly userWallCommentModel: Model<UserWallCommentEntityDocument>,
  ){}

  async create(document): Promise<UserWallCommentEntityDocument> {
    const item = new this.userWallCommentModel(document);
    await item.save();
    return await item.populate('user').populate('wall').execPopulate();
  }

  async findPaginate(getPaginate: GetUserWallCommentDto){
    const countPromise = this.userWallCommentModel.countDocuments({ wall: getPaginate.wallId });
    const docsPromise = this.userWallCommentModel.find({ wall: getPaginate.wallId })
    .populate('user').populate('wall')
      .skip( Number(getPaginate.limit * (getPaginate.page - 1)) )
      .limit( Number(getPaginate.limit) )
      .sort('id').exec();

    const [total, items] = await Promise.all([countPromise, docsPromise]);
    return {
      total,
      items
    }
    
  }

  async findById(id: string): Promise<UserWallCommentEntityDocument> {
    return await this.userWallCommentModel.findById(id)
    .populate('user').populate('wall')
    .exec();
  }

  async update(id: string, object): Promise<UserWallCommentEntityDocument> {
    await this.userWallCommentModel.findByIdAndUpdate(id, object);
    return await this.findById(id);
  }

  async remove(id: string): Promise<UserWallCommentEntityDocument> {
    return await this.userWallCommentModel.findByIdAndDelete(id);
  }

}
