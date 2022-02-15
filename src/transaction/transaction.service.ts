import { Injectable, BadRequestException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { TransactionEntityDocument } from './entities/transaction.entity'
import { Model } from 'mongoose'
import { GetTransactionDto } from './dto/get-transaction.dto'
import * as mongoose from 'mongoose'
import { UsersService } from 'src/users/users.service';
import { OrdersService } from 'src/orders/orders.service';
import { LevelService } from 'src/level/level.service';
import { FirebaseCloudMessageService, INotifyMessageBody } from 'src/firebase/firebase.service'
import { GetTransactionHistoryDto } from './dto/get-transaction-history.dto'
import { User } from 'src/users/interfaces/user.interface'
import { AdminGetTransactionHistoryDto } from './dto/admin-get-transaction-history.dto'

@Injectable()
export class TransactionService {

    constructor(
        @InjectModel('Transaction') private readonly transactionModel: Model<TransactionEntityDocument>,
        private readonly userService: UsersService,
        private readonly orderService: OrdersService,
        private readonly levelService: LevelService,
        private readonly firebaseNotifyService: FirebaseCloudMessageService,

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

    async findHistory(user: string, query: GetTransactionHistoryDto): Promise<any> {
        let queryDocs = {};
        queryDocs['user'] = user;
        if( query.method ){
            queryDocs['paymentMethod'] = query.method;
        }

        const countPromise = this.transactionModel.countDocuments(queryDocs);
        const docsPromise = this.transactionModel.find(queryDocs)
            .populate('user')
            .sort({ createdAt: -1 })
            .skip( Number( (query.page - 1)*query.limit ) )
            .limit( Number( query.limit ) )
            .exec()
    
        const [total, items] = await Promise.all([countPromise, docsPromise]);

        return {
          total,
          items
        }
    }

    async findById( id: string ): Promise<TransactionEntityDocument>{
        return await this.transactionModel.findById(id)
    }

    async getTotalByUser( userId: string ){
        return await this.transactionModel.aggregate([
            { 
                $match: { 
                    user: new mongoose.Types.ObjectId(userId),
                    status: "success"
                },
            },
            { $group: { _id: "$user" , total: { $sum: "$total" }} },
            { $project: { _id: 0, total: 1, } }
        ]).exec();
    }

    async upgradeLevelUser( userId: string ){
        const allLevel = await this.levelService.getAll();
        const currentAmountTotalBlance = await this.getUserBlance(userId);

        for( const level of allLevel ){
            if( currentAmountTotalBlance >= level.minTarget  ){
            
                await this.userService.updateUser( userId, {
                    userLevel: level.id
                })
                const notifyData = {
                    title: `Congratulation!`,
                    body: 'You are upgrade level.',
                    imageUrl: 'https://d21y6rmzuyq1qt.cloudfront.net/27a2ff52-6ae1-49e3-bde6-6427b661588f' ,
                    metaData: {
                        userId: userId
                    },
                    clickAction: 'LEVEL_UPGRADED'
                } as INotifyMessageBody
            
                // notify to guest user
                const fcmTokens: string[] = await this.userService.getUserFcmToken( userId );
                if(fcmTokens.length > 0){
                    this.firebaseNotifyService.sendMessage( fcmTokens, notifyData );
                }
                
                break;
            }
        }
        return ;
    }

    async getUserBlance(userId: string){
        const findUser = await this.userService.findById(userId);
        if(!findUser) throw new BadRequestException('User not found');
        const pay = await this.getTotalByUser(userId); // total topup, send, received
        const spent = await this.orderService.getUserTotalOrdered(userId); // total buy gifts items
        
        let balance = 0;
        if( pay.length > 0 && spent.length > 0){
            balance = pay[0]['total'] - spent[0]['total'];
        }else if( pay.length > 0 && spent.length <= 0 ){
            balance = pay[0]['total'];
        }else if( pay.length <= 0){
            balance = 0;
        }
        return balance;
    }

    // admin
    async adminGetAllTransaction(query: AdminGetTransactionHistoryDto): Promise<any> {
        let queryDocs = {};
        if( query.method ){
            queryDocs['paymentMethod'] = query.method;
        }

        if( query.user ){
            queryDocs['user'] = query.user;
        }
        
        const countPromise = this.transactionModel.countDocuments(queryDocs);
        const docsPromise = this.transactionModel.find(queryDocs)
            .populate('user')
            .sort({ createdAt: -1 })
            .skip( Number( (query.page - 1)*query.limit ) )
            .limit( Number( query.limit ) )
            .exec()
    
        const [total, items] = await Promise.all([countPromise, docsPromise]);

        return {
          total,
          items
        }
    }
}
