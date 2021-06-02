import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShopEntityDocument } from './entities/shop.entity';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { GetShopDto } from './dto/get-shop.dto';
import { SHOP_MODEL } from 'src/mongo-model.constance';

@Injectable()
export class ShopService {
    constructor(
        @InjectModel( SHOP_MODEL ) private readonly shopModel: Model<ShopEntityDocument>,
    ){}

    async create( createDto: object ): Promise<ShopEntityDocument> {
        const doc = new this.shopModel( createDto );
        await doc.save();
        return await doc
            .populate('category')
            .populate('user')
            .execPopulate();
    }

    async findById( id: string ): Promise<ShopEntityDocument> {
        return await this.shopModel.findById(id)
            .populate('category')
            .populate('user')
            .exec();
    }

    async findAll(query: GetShopDto): Promise<ShopEntityDocument[]> {

        const builder = this.shopModel.find();
            if( query.status ) builder.where({ status: query.status.toString() });
            if( query.title ) builder.where({ title: query.title.toString() });

        return await builder
            .populate('category')
            .populate('user')
            .sort({ createdAt: -1 })
            .limit( Number(query.limit) )
            .skip( Number(query.limit) * (Number(query.page) - 1) )
            .exec();

    }

    async update(id: string, updateDto: object ): Promise<ShopEntityDocument>  {
        await this.shopModel.findByIdAndUpdate( id, updateDto );
        return await this.shopModel.findById(id)
            .populate('category')
            .populate('user')
            .exec();
    }
    
    async remove(id: string): Promise<any> {
        return await this.shopModel.findByIdAndRemove( id );
    }
}