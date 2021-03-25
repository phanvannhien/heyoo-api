import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { OrderEntityDocument } from './entities/order.entity'
import { GetOrderDto } from './dto/get-orders.dto'
import * as mongoose from 'mongoose'

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel('Order') private readonly orderModel: Model<OrderEntityDocument>,
    ){}

    async create( data ): Promise<OrderEntityDocument>{
        const n = new this.orderModel(data)
        await n.save()
        return n.populate('user').populate('product').execPopulate()
    }

    async findAll(query: GetOrderDto): Promise<OrderEntityDocument[]> {
        return await this.orderModel.find()
            .populate('user')
            .populate('product')
            .sort({ createdAt: -1 })
            .skip( Number( (query.page - 1)*query.limit ) )
            .limit( Number( query.limit ) )
            .exec();
    }

    async getUserTotalOrdered(userId): Promise<any>{
        return await this.orderModel.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId) } },
            { $group: { _id: "$user" , total: { $sum: "$total" }} },
            { $project: { _id: 0, total: 1, } }
        ]).exec()
    }

}
