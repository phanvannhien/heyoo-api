import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShopEntityDocument } from './entities/shop.entity';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { GetShopDto } from './dto/get-shop.dto';
import { SHOP_MODEL, SHOP_FOLLOW_MODEL } from 'src/mongo-model.constance';
import { ShopFollowEntityDocument } from './entities/follow.entity';
import * as mongoose from 'mongoose';

@Injectable()
export class ShopService {
    constructor(
        @InjectModel( SHOP_MODEL ) private readonly shopModel: Model<ShopEntityDocument>,
        @InjectModel( SHOP_FOLLOW_MODEL ) private readonly followModel: Model<ShopFollowEntityDocument>,
    ){}

    async create( createDto: object ): Promise<ShopEntityDocument> {
        const doc = new this.shopModel( createDto );
        await doc.save();
        return await doc
            .populate('category')
            .populate('user')
            .execPopulate();
    }

    async findShopWithCountFollow(id: string): Promise<object>{
        const shop = await this.shopModel.findById(id)
            .populate('category')
            .populate('user')
            .exec();
            
        const followCount = await this.followModel.count({ shop: shop });
        const data = {
            ...shop.toObject(),
            followCount: followCount
        };
        return data;
    }

    async findById( id: string ): Promise<ShopEntityDocument> {
        return await this.shopModel.findById(id)
            .populate('category')
            .populate('user')
            .exec();
    }

    async findAll(query: GetShopDto): Promise<ShopEntityDocument[]> {
        return await this.shopModel
        .aggregate([
            {
                $lookup: {
                    from: "shop-categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "category"
                }
            },
            
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user"
                }
            },
           
            {
                $lookup: {
                    from: "shop_follows",
                    localField: "_id",
                    foreignField: "shop",
                    as: "followers"
                }
            },

            { $unwind: { path: "$category" } },
            { $unwind: { path: "$user" } },
           
            {
                $addFields: {
                    followCount: { $size: '$followers' },    
                }
            },
            { $sort: { createdAt: -1 } },
            { $limit: Number(query.limit) },
            { $skip:  Number(query.limit) * (Number(query.page) - 1) }

        ]).exec()

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

    /**
     * Follow
     */
     async doFollow(userId, shopId): Promise<any>{
        const findShop = await this.shopModel.findById(shopId);
        if (!findShop) throw new BadRequestException('Shop not found');

        const followExist = await this.followModel.findOne({
            user: userId,
            shop: shopId
        }).exec();

        if (followExist) return followExist;

        const newFollow = await this.followModel.create({
            user: userId,
            shop: shopId
        });

        return newFollow;
    }

    async unFollow(userId, shopId): Promise<any>{
        await this.followModel.findOneAndDelete({
            user: userId,
            shop: shopId
        }).exec()
        return true
    }

    async getCountShopFollow(shop: ShopEntityDocument ){
        return await this.followModel.count({ shop: shop });
    }
}