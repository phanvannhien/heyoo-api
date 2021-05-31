import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VideosEntityDocument } from './entities/videos.entity';
import { CreateVideosDto } from './dto/create-videos.dto';
import { UpdateVideosDto } from './dto/update-videos.dto';
import { GetVideosDto } from './dto/get-videos.dto';

@Injectable()
export class VideosService {
    constructor(
        @InjectModel('videos') private readonly newsModel: Model<VideosEntityDocument>,
    ){}

    async create( createDto: object ): Promise<VideosEntityDocument> {
        const doc = new this.newsModel( createDto );
        await doc.save();
        return await doc.populate('category').execPopulate();
    }

    async findById( id: string ): Promise<VideosEntityDocument> {
        return await this.newsModel.findById(id)
            .populate('category')
            .exec();
    }

    async findAll(query: GetVideosDto): Promise<VideosEntityDocument[]> {

        const builder = this.newsModel.find();
            if( query.status ) builder.where({ status: query.status.toString() });
            if( query.title ) builder.where({ title: query.title.toString() });

        return await builder
            .populate('category')
            .sort({ createdAt: -1 })
            .limit( Number(query.limit) )
            .skip( Number(query.limit) * (Number(query.page) - 1) )
            .exec();

    }

    async update(id: string, updateDto: object ): Promise<VideosEntityDocument>  {
        await this.newsModel.findByIdAndUpdate( id, updateDto );
        return await this.newsModel.findById(id)
            .populate('category')
            .exec();
    }
    
    async remove(id: string): Promise<any> {
        return await this.newsModel.findByIdAndRemove( id );
    }
}
