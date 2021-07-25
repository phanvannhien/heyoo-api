import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LevelEntityDocument } from './entities/level.entity';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { GetLevelDto } from './dto/get-level.dto';

@Injectable()
export class LevelService {
    constructor(
        @InjectModel('Level') private readonly levelModel: Model<LevelEntityDocument>,
    ){}

    async create( createDto: CreateLevelDto): Promise<any> {
        const doc = new this.levelModel( createDto );
        return await doc.save();
    }

    async findById( id: string ): Promise<any> {
        return await this.levelModel.findById(id).exec();
    }

    async getMinLevel(): Promise<any> {
        return await this.levelModel.findOne({
            minTarget: 0
        }).exec();
    }


    async getAll(): Promise<LevelEntityDocument[]> {
        return await this.levelModel.find()
            .sort({ minTarget: -1 })
            .exec();
    }

    async findAll(query: GetLevelDto): Promise<LevelEntityDocument[]> {
        return await this.levelModel.find()
            .sort({ minTarget: -1 })
            .skip( Number( (query.page - 1)*query.limit ) )
            .limit( Number( query.limit ) )
            .exec();
    }

    async update(id: string, updateDto: UpdateLevelDto): Promise<any>  {
        return await this.levelModel.findByIdAndUpdate( id, updateDto );
    }
    
    async remove(id: string): Promise<any> {
        return await this.levelModel.findByIdAndRemove( id );
    }


}
