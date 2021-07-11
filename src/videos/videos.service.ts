import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VideosEntityDocument } from './entities/videos.entity';
import { CreateVideosDto } from './dto/create-videos.dto';
import { UpdateVideosDto } from './dto/update-videos.dto';
import { GetVideosDto } from './dto/get-videos.dto';
import { QueryPaginateDto } from 'src/common/dto/paginate.dto';
import * as mongoose from 'mongoose';

@Injectable()
export class VideosService {
    constructor(
        @InjectModel('videos') private readonly videoModel: Model<VideosEntityDocument>,
    ){}

    async create( createDto: object ): Promise<VideosEntityDocument> {
        const doc = new this.videoModel( createDto );
        await doc.save();
        return await doc.populate('category').execPopulate();
    }

    async findById( id: string ): Promise<VideosEntityDocument> {
        return await this.videoModel.findById(id)
            .populate('category')
            .exec();
    }

    async findAll(query: GetVideosDto): Promise<VideosEntityDocument[]> {

        let matchQuery = {
            isHot: false
        };
    
        if( query.category ){
            matchQuery['category'] = new mongoose.Types.ObjectId(query.category);
        }

        return await this.videoModel.aggregate([
            { 
              $match: matchQuery
            },
            {
              $lookup: {
                  from: "video-categories",
                  localField: "category",
                  foreignField: "_id",
                  as: "category"
              }
            },
           
            { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
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
        ]).exec(); 
        
    }

    async update(id: string, updateDto: object ): Promise<VideosEntityDocument>  {
        await this.videoModel.findByIdAndUpdate( id, updateDto );
        return await this.videoModel.findById(id)
            .populate('category')
            .exec();
    }
    
    async remove(id: string): Promise<any> {
        return await this.videoModel.findByIdAndRemove( id );
    }


    async getHot(): Promise<VideosEntityDocument[]> {
        return await this.videoModel.find({
                isHot: true
            })
            .populate('category')
            .sort({ '_id': -1 })
            .limit(5)
            .exec();
    }

    async relation( video: VideosEntityDocument, paginate: QueryPaginateDto ): Promise<VideosEntityDocument[]> {

        return await this.videoModel.find({
                isHot: false,
                _id: { $ne: video.id },
                category: video.category
            })
            .populate('category')
            .sort({ '_id': -1 })
            .limit( Number(paginate.limit) )
            .skip( Number(paginate.limit) * (Number(paginate.page) - 1) )
            .exec();
    }

}
