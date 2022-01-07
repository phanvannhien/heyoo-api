import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesEntityDocument } from './entities/category.entity';
import { GetCategoryDto } from './dto/get-category.dto';
import { LiveStreamEntityDocument } from 'src/livestreams/entities/livestream.entity';
import * as mongoose from 'mongoose';

@Injectable()
export class CategoriesService {

  constructor(
    @InjectModel('Categories') private readonly categoryModel: Model<CategoriesEntityDocument>,
    @InjectModel('LiveStreams') private readonly liveStreamModel: Model<LiveStreamEntityDocument>,
  ){}

  async create(createCategoryDto: CreateCategoryDto): Promise<CategoriesEntityDocument> {
    const i = new this.categoryModel( createCategoryDto );
    return await i.save();
  }

  async findAll(): Promise<CategoriesEntityDocument[]> {
    return await this.categoryModel.find().exec();
  }

  async findAllCategories(query: GetCategoryDto): Promise<CategoriesEntityDocument[]> {

    return await this.categoryModel.find()
      .skip( Number( (query.page - 1)*query.limit ) )
      .limit( Number( query.limit ) )
      .exec();
  }

  async findOne(id: string): Promise<CategoriesEntityDocument> {
    return await this.categoryModel.findById( id );
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<CategoriesEntityDocument> {
    return this.categoryModel.findByIdAndUpdate( id, updateCategoryDto );
  }

  async remove(id: string): Promise<any> {
    return await this.categoryModel.findByIdAndRemove(id);
  }

  async getLiveByCategory(id: string, query): Promise<any> {

    const arrFind = [ new mongoose.Types.ObjectId(id) ]

    return await this.liveStreamModel
      .find({ 
        endLiveAt : { $exists: false },
        categories: { $in: arrFind } 
      })
      .populate('categories')
      .populate('streamer')
      .skip( Number(query.limit) * (Number(query.page) - 1) )
      .limit( Number(query.limit) )
      .sort({'startLiveAt': -1 })
      .exec();

    // return await this.categoryModel.aggregate([
    //   { $match: { _id:  new Types.ObjectId(id)  } },
    //   {
    //     $lookup: {
    //       from: "livestreams",
    //       let: {
    //         'categoryId': '$_id'
    //       },
    //       'pipeline': [
    //         {
    //           '$match': { '$expr': { $in: [ '$$categoryId', '$categories' ] } }
    //         }, 
    //         { '$sort': {  'startLiveAt': -1 } }, 
    //         { $limit: Number(query.limit) },
    //         { $skip:  Number(query.limit) * (Number(query.page) - 1) }
    //       ],
    //       as: "livestreams"
    //     }
    //   },
    //   {
    //     $unwind: {
    //       path: "$livestreams",
    //       preserveNullAndEmptyArrays: true
    //     }
    //   },
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "streamer",
    //       foreignField: "_id",
    //       as: "streamer"
    //     }
    //   },
    // ])
    // .exec();
   
  }


  async getAllLiveStream(query): Promise<any> {

    return await this.liveStreamModel
      .find({ endLiveAt : null })
      .populate({
        path: 'categories'
      })
      .populate('streamer')
      .skip( Number(query.limit) * (Number(query.page) - 1) )
      .limit( Number(query.limit) )
      .sort({'startLiveAt': -1 })
      .exec();
  }
}
