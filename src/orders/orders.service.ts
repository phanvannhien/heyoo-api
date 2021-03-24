import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderEntityDocument } from './entities/order.entity';

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
}
