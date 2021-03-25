import { Injectable, BadRequestException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { TransactionEntityDocument } from './entities/transaction.entity'
import { Model } from 'mongoose'
import { GetTransactionDto } from './dto/get-transaction.dto'
import * as mongoose from 'mongoose'
import { UsersService } from 'src/users/users.service';
import { OrdersService } from 'src/orders/orders.service';

@Injectable()
export class TransactionService {

    constructor(
        @InjectModel('Transaction') private readonly transactionModel: Model<TransactionEntityDocument>,
        private readonly userService: UsersService,
        private readonly orderService: OrdersService,
    ){}

    async create( data ): Promise<TransactionEntityDocument>{
        const n = new this.transactionModel(data)
        await n.save()
        return n.populate('user').execPopulate()
    }

    async createMany( data ): Promise<any>{
        return await this.transactionModel.insertMany( data )
    }

    async findAll(query: GetTransactionDto): Promise<TransactionEntityDocument[]> {
        return await this.transactionModel.find()
            .populate('user')
            .sort({ createdAt: -1 })
            .skip( Number( (query.page - 1)*query.limit ) )
            .limit( Number( query.limit ) )
            .exec()
    }

    async findById( id: string ): Promise<TransactionEntityDocument>{
        return await this.transactionModel.findById(id)
    }

    async getTotalByUser( userId: string ){
      
        return await this.transactionModel.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId) } },
            { $group: { _id: "$user" , total: { $sum: "$total" }} },
            { $project: { _id: 0, total: 1, } }
        ]).exec()
    }

    async getUserBlance(userId: string){
        const findUser = await this.userService.findById(userId)
        if(!findUser) throw new BadRequestException('User not found')

        const pay = await this.getTotalByUser(userId)
        const spent = await this.orderService.getUserTotalOrdered(userId)
        let balance = 0
        if( pay.length > 0 && spent.length > 0){
            balance = pay[0]['total'] - spent[0]['total']
        }else if( pay.length > 0 && spent.length <= 0 ){
            balance = pay[0]['total']
        }else if( pay.length <= 0){
            balance = 0
        }
        return balance
    }
}
