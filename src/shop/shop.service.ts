import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel, MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShopEntityDocument } from './entities/shop.entity';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { GetShopDto } from './dto/get-shop.dto';
import { SHOP_MODEL, SHOP_FOLLOW_MODEL } from 'src/mongo-model.constance';
import { ShopFollowEntityDocument } from './entities/follow.entity';
import * as mongoose from 'mongoose';
import { QueryPaginateDto } from 'src/common/dto/paginate.dto';
import { LiveStreamEntityDocument } from 'src/livestreams/entities/livestream.entity';

@Injectable()
export class ShopService {
    constructor(
        @InjectModel( SHOP_MODEL ) private readonly shopModel: Model<ShopEntityDocument>,
        @InjectModel( SHOP_FOLLOW_MODEL ) private readonly followModel: Model<ShopFollowEntityDocument>,
        @InjectModel('LiveStreams') private readonly liveStreamModel: Model<LiveStreamEntityDocument>,
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

    async findById( id: string ): Promise<ShopEntityDocument>{
        return await this.shopModel.findById(id)
            .populate('category')
            .populate('user')
            .exec();
    }

    async findShopProfile( id: string, request ): Promise<ShopEntityDocument> {

        return await this.shopModel
        .aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(id)
                }
            }, 
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

            {
                $lookup: {
                    from: "shop_follows",
                    let: { userId: new mongoose.Types.ObjectId(request.user.id) , shopId: new mongoose.Types.ObjectId(id) },
                    pipeline: [
                        {
                            $match: {
                                $and: [
                                    { $expr: { $eq: ['$shop', '$$shopId'] } },
                                    { $expr: { $eq: ['$user', '$$userId'] } },
                                ]  
                            }
                        },
                        { $limit: 1 }
                    ],
                    as: "checkFollows"
                }
            },

            {
                $lookup: {
                    from: 'livestreams',
                    let: { shopId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $and: [
                                    { 
                                        $expr: { $eq: ['$shop', '$$shopId'] }
                                    },
                                    {
                                        "endLiveAt" : { $exists: false }
                                    }
                                ]  
                            }
                            
                        },
                        
                        {
                            $lookup: {
                                from: "users",
                                localField: "streamer",
                                foreignField: "_id",
                                as: "streamer"
                            }
                        },
                        {
                            $lookup: {
                                from: "categories",
                                localField: "categories",
                                foreignField: "_id",
                                as: "categories"
                            }
                        },
                        {
                            $unwind: {  path: "$streamer" }
                        },
                        { $sort: { _id: -1 } },
                        { $limit: 1 }
                    ],
                    as: 'livestreams'
                }
            },

            { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
            { $unwind: {  path: "$livestreams", preserveNullAndEmptyArrays: true } },

            {
                $addFields: {
                    followCount: { $size: '$followers' },
                    isLiveStreamNow: {
                        $cond: {
                            if:  "$livestreams" , then: true, else: false 
                        }
                    },
                    isFollow: { $cond: { if: {$gt: [{$size: "$checkFollows"}, 0 ]} , then: true, else: false } },
                    livestream: {
                        $cond: {
                            if:  "$livestreams" , then: "$livestreams"  , else: null 
                        }
                    },
                }
            },
            { $limit: 1 }
        ]).exec()

    }

    async getShopVideos( id, query: QueryPaginateDto): Promise<any>{
        return await this.liveStreamModel.aggregate([
            { 
              $match: {
                shop: new mongoose.Types.ObjectId(id),
                videoUrl: { $exists: true, $ne: null }
              }
            },
            {
              $lookup: {
                  from: "users",
                  localField: "streamer",
                  foreignField: "_id",
                  as: "streamer"
              }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "categories",
                    foreignField: "_id",
                    as: "category"
                }
            },
            { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
            { $unwind: {  path: "$streamer", preserveNullAndEmptyArrays: true } },
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
    
    

    async checkUserHasShop( user ): Promise<boolean>{
        const find = await this.shopModel.aggregate([
            { 
                $match: { user: new mongoose.Types.ObjectId(user.id) } 
            },
            {
                $count: "countShop"
            }
        ]).exec();
        if(find[0]?.countShop > 0) return true;
        return false;
    }

    async findAll(query: GetShopDto): Promise<ShopEntityDocument[]> {
        return await this.shopModel
        .aggregate([
            {
                $match: {
                    shopName: { $regex: new RegExp( query.title, 'i' ) }
                }
            }, 
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

            { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
           
            {
                $addFields: {
                    followCount: { $size: '$followers' },    
                }
            },
            { $sort: { "_id" : -1 } },
            // { $limit: Number(query.limit) },
            // { $skip:  Number(query.limit) * (Number(query.page) - 1) },
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