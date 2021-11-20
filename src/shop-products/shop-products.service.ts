import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShopProductEntityDocument } from './entities/shop-product.entity';
import { CreateShopProductDto } from './dto/create-shop-product.dto';
import { UpdateShopProductDto } from './dto/update-shop-product.dto';
import { GetShopProductDto } from './dto/get-shop-product.dto';

@Injectable()
export class ShopProductsService {
    constructor(
        @InjectModel('ShopProduct') private readonly productModel,
    ){}

    async create( createDto: CreateShopProductDto): Promise<any> {
        const doc = new this.productModel( createDto );
        return await doc.save();
    }

    async findById( id: string ): Promise<any> {
        return await this.productModel.findById(id).exec();
    }

    async findPaginate(query: GetShopProductDto){
        const countPromise = this.productModel.countDocuments({ shop: query.shop });
        const docsPromise = this.productModel.find({ shop: query.shop })
            .sort({ id: 1 })
            .skip( Number( (query.page - 1)*query.limit ) )
            .limit( Number( query.limit ) )
            .exec();
    
        const [total, items] = await Promise.all([countPromise, docsPromise]);
        return {
          total,
          items
        }
    }
    
    async update(id: string, updateDto: UpdateShopProductDto): Promise<any>  {
        await this.productModel.findByIdAndUpdate( id, updateDto );
        return await this.findById(id);
    }
    
    async remove(id: string): Promise<any> {
        return await this.productModel.deleteById( id );
    }
}
