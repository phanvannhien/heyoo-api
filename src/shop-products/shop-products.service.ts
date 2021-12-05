import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShopProductEntityDocument } from './entities/shop-product.entity';
import { CreateShopProductDto } from './dto/create-shop-product.dto';
import { UpdateShopProductDto } from './dto/update-shop-product.dto';
import { GetShopProductDto } from './dto/get-shop-product.dto';
import { GetShopProductRelatedDto } from './dto/get-shop-product-related.dto';

@Injectable()
export class ShopProductsService {
    constructor(
        @InjectModel('ShopProduct') private readonly productModel,
    ){}

    async create( createDto: CreateShopProductDto): Promise<any> {
        const doc = new this.productModel( createDto );
        await doc.save();
        return await doc.populate('category').execPopulate();
    }

    async findById( id: string ): Promise<any> {
        return await this.productModel.findById(id).populate('category').exec();
    }

    async findPaginate(query: GetShopProductDto){
        const countPromise = this.productModel.countDocuments({ shop: query.shop, isPublished: true });
        const docsPromise = this.productModel.find({ 
            shop: query.shop,
            isPublished: true
         })
            .populate('category')
            .sort('-_id')
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

    async getRelatedProduct( product: ShopProductEntityDocument, query: GetShopProductRelatedDto){

        const countPromise = this.productModel.countDocuments({
            _id: { $ne: product.id },
            shop: product.shop
        });
        const docsPromise = this.productModel.find({
            _id: { $ne: product.id },
            shop: product.shop
        })
            .populate('category')
            .sort('-_id')
            .limit( Number(query.limit) )
            .skip( Number(query.limit) * (Number(query.page) - 1) )
            .exec();
    
        const [total, items] = await Promise.all([countPromise, docsPromise]);
        return {
          total,
          items
        }

    }
}
