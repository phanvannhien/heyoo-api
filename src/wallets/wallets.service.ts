import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { WalletEntityDocument } from './entities/wallet.entity';
import { Model } from 'mongoose';
import { GetWalletsDto } from './dto/get-wallets.dto';
import * as mongoose from 'mongoose';
import { LiveStreamEntityDocument } from 'src/livestreams/entities/livestream.entity';

@Injectable()
export class WalletsService {
    constructor(
        @InjectModel('Wallet') private readonly walletModel: Model<WalletEntityDocument>,
    ){}

    async create( data ): Promise<WalletEntityDocument>{
        const n = new this.walletModel(data)
        await n.save()
        return n
            .populate('user')
            .populate('toUser')
            .populate('product')
            .execPopulate()
    }

    async findById( id: string ): Promise<any> {
        return await this.walletModel.findById(id).exec();
    }

    async findAll(query: GetWalletsDto): Promise<WalletEntityDocument[]> {
        return await this.walletModel.find()
            .populate('user')
            .populate('toUser')
            .populate('product')
            .sort({ createdAt: -1 })
            .skip( Number( (query.page - 1)*query.limit ) )
            .limit( Number( query.limit ) )
            .exec();
    }

    async getUserWalletIn(userId: string){
        return await this.walletModel
            .aggregate([
                { 
                    $match: { toUser: new mongoose.Types.ObjectId(userId) }
                },
                {
                    $group: { _id: "$product" , quantity: { $sum: "$quantity" }}
                },
                {
                    $lookup: {
                        from: "products",
                        localField: "_id",
                        foreignField: "_id",
                        as: "product_info"
                    }
                },
                { $unwind: "$product_info" },
                { 
                    $project: {
                        _id: 0,
                        quantity: 1,
                        image: "$product_info.image",
                        productName: "$product_info.productName"
                    }
                },

            ])
        
        .exec()
    }

    async getUserWalletOut(userId: string){
        return await this.walletModel
            .aggregate([
                { 
                    $match: { user: new mongoose.Types.ObjectId(userId) }
                },
                {
                    $group: { _id: "$product" , total: { $sum: "$quantity" }}
                },
                { 
                    $project: {
                        product: 1,
                        image: 1,
                        total: 1
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        localField: "_id",
                        foreignField: "_id",
                        as: "product_info"
                    }
                },
                { $unwind: "$product_info" },
                { 
                    $project: {
                        _id: 0,
                        total: 1,
                        image: "$product_info.image",
                        productName: "$product_info.productName"
                    }
                },

            ])
        
        .exec()
    }

    async getUserProductLiveStreamDonate( liveStream: LiveStreamEntityDocument, userId ){
        
        const products = await this.walletModel
            .aggregate([
                { 
                    $match: { 
                        toUser: new mongoose.Types.ObjectId(userId),
                        liveStream: new mongoose.Types.ObjectId(liveStream.id),
                        donateUid: liveStream.donateUid
                    }
                },
                {
                    $group: { _id: "$product" , total: { $sum: "$total" }}
                },

                {
                    $lookup: {
                        from: "products",
                        localField: "_id",
                        foreignField: "_id",
                        as: "product"
                    }
                },
                { $unwind: "$product" },

                // { 
                //     $project: {
                //         _id: 1,
                //         total: 1,
                //         image: "$product.image",
                //         productName: "$product.productName",
                //         imageAnimation: "$product.imageAnimation",
                //     }
                // },

            ])
        
        .exec()

        const total = products.reduce((a, b) => a + (b['total'] || 0), 0);

        return {
            total: total,
            items: products
        }
    }


    async getTotalDonate(userId: string): Promise<any>{
        return await this.walletModel.aggregate([
            { $match: { toUser: new mongoose.Types.ObjectId(userId) } },
            { $group: { _id: "$toUser" , total: { $sum: "$total" }} },
            { $project: { _id: 0, total: 1, } }
        ]).exec()
    }

}
