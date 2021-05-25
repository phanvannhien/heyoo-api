import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NewsEntityDocument } from './entities/news.entity';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { GetNewsDto } from './dto/get-news.dto';

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

    async findById( id: string ): Promise<any> {
        return await this.newsModel.findById(id)
            .populate('category')
            .exec();
    }

    async findAll(query: GetNewsDto): Promise<NewsEntityDocument[]> {
        return await this.newsModel.find()
            .populate('category')
            .sort({ createdAt: -1 })
            .skip( Number( (query.page - 1)*query.limit ) )
            .limit( Number( query.limit ) )
            .exec();
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
}
