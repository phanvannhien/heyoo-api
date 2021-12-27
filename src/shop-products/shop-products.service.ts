import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShopProductEntityDocument } from './entities/shop-product.entity';
import { CreateShopProductDto } from './dto/create-shop-product.dto';
import { UpdateShopProductDto } from './dto/update-shop-product.dto';
import { GetShopProductDto } from './dto/get-shop-product.dto';
import { GetShopProductRelatedDto } from './dto/get-shop-product-related.dto';
import { GetSearchShopProductDto } from './dto/get-search-product.dto';
import * as mongoose from 'mongoose';

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

    async findPaginate(shopOfUser: any, query: GetShopProductDto){

        const queryData = shopOfUser && query.shop.toString() === shopOfUser.id.toString()
            ? { shop: query.shop }
            : { shop: query.shop, isPublished: true } 

        const countPromise = this.productModel.countDocuments(queryData);
        const docsPromise = this.productModel.find(queryData)
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

    async searchProductToLivestream(shopOfUserRequest, query: GetSearchShopProductDto){
        let queryDocs = {
            isPublished: true,
            shop: shopOfUserRequest.id.toString()
        }

        if( query.productName ){
            query.productName = query.productName.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
            queryDocs['productName'] = { $regex: new RegExp( query.productName ), $options: 'i' }
        }
       
        const countPromise = this.productModel.countDocuments(queryDocs);
        const docsPromise = this.productModel.find(queryDocs)
            .populate('category')
            .sort('-_id')
            .skip( Number( (query.page - 1) * query.limit ) )
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

    async getRelatedProduct(shopOfUser:any, product: ShopProductEntityDocument, query: GetShopProductRelatedDto){

        const queryData = shopOfUser && product.shop.toString() === shopOfUser.id.toString()
            ? { shop: product.shop, _id: { $ne: product.id } }
            : { shop: product.shop, isPublished: true, _id: { $ne: product.id } } 

        const countPromise = this.productModel.countDocuments(queryData);
        const docsPromise = this.productModel.find(queryData)
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
    // ADMIN
    async findAdminPaginate(query: GetShopProductDto){
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
    
}
