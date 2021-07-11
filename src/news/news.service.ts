import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NewsEntityDocument } from './entities/news.entity';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { GetNewsDto } from './dto/get-news.dto';
import * as mongoose from 'mongoose';
import { QueryPaginateDto } from 'src/common/dto/paginate.dto';
import { GetForAdminDto } from './dto/get-for-admin.dto';

@Injectable()
export class NewsService {
    constructor(
        @InjectModel('News') private readonly newsModel: Model<NewsEntityDocument>,
    ){}

    async create( createDto: object ): Promise<any> {
        const doc = new this.newsModel( createDto );
        await doc.save();
        return await doc.populate('category').execPopulate();
    }

    async findById( id: string ): Promise<NewsEntityDocument> {
        return await this.newsModel.findById(id)
            .populate('category')
            .exec();
    }

    async getHotNews(): Promise<NewsEntityDocument[]> {
        return await this.newsModel.find({
                isHot: true
            })
            .populate('category')
            .sort({ '_id': -1 })
            .limit(5)
            .exec();
    }

    async relation( news: NewsEntityDocument, paginate: QueryPaginateDto ): Promise<NewsEntityDocument[]> {

        return await this.newsModel.find({
                isHot: false,
                _id: { $ne: news.id },
                category: news.category
            })
            .populate('category')
            .sort({ '_id': -1 })
            .limit( Number(paginate.limit) )
            .skip( Number(paginate.limit) * (Number(paginate.page) - 1) )
            .exec();
    }

    
    async findAll(query: GetNewsDto): Promise<NewsEntityDocument[]> {

        let matchQuery = {
            isHot: false
        };
    
        if( query.category ){
            matchQuery['category'] = new mongoose.Types.ObjectId(query.category);
        }

        return await this.newsModel.aggregate([
            { 
              $match: matchQuery
            },
            {
              $lookup: {
                  from: "news-categories",
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

    async update(id: string, updateDto: object ): Promise<any>  {
        await this.newsModel.findByIdAndUpdate( id, updateDto );
        return await this.newsModel.findById(id)
            .populate('category')
            .exec();
    }
    
    async remove(id: string): Promise<any> {
        return await this.newsModel.findByIdAndRemove( id );
    }


    async updateHot( video: NewsEntityDocument ): Promise<NewsEntityDocument>  {
        await this.newsModel.findByIdAndUpdate( video.id, {
            isHot: !video.isHot
        });
        return await this.newsModel.findById(video.id)
            .populate('category')
            .exec();
    }

    async getForAdmin(query: GetForAdminDto): Promise<NewsEntityDocument[]> {

        let matchQuery = {};

        if( query.isHot ){
            matchQuery['isHot'] = query.isHot.toString() == 'true' ? true: false ;
        }

        if( query.title ){
            matchQuery['title'] = { $regex: new RegExp( query.title, 'i' ) };
        }
    
        if( query.category ){
            matchQuery['category'] = new mongoose.Types.ObjectId(query.category);
        }
 
        return await this.newsModel.aggregate([
            { 
              $match: matchQuery
            },
            {
              $lookup: {
                  from: "news-categories",
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
}
