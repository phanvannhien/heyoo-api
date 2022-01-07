import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AdminGetPaymentDto } from './dto/admin-get-payment-paginate.dto';
import { AdminUpdateStatusDto } from './dto/admin-update-status.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentEntityDocument } from './entities/payment.entity';

@Injectable()
export class PaymentService {

    constructor(
        @InjectModel('Payment') private readonly mongoModel,
    ){}

    async findById( id: string ): Promise<PaymentEntityDocument> {
        return await this.mongoModel.findById(id).exec();
    }

    async create( createDto: CreatePaymentDto): Promise<PaymentEntityDocument> {
        const doc = new this.mongoModel( createDto );
        return await doc.save();
    }

    async updateStatus(id: string, status: string ): Promise<any>  {
        return await this.mongoModel.findByIdAndUpdate( id, {
            status: status
        });
    }

    //admin
    async adminGetPaginate( query: AdminGetPaymentDto ): Promise<any> {

        let queryDocs = {};
      
        if( query.user ){
            queryDocs['user'] = query.user;
        }

        if( query.status ){
            queryDocs['status'] = query.status;
        }
        
        const countPromise = this.mongoModel.countDocuments(queryDocs);
        const docsPromise = this.mongoModel.find(queryDocs)
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

    async adminUpdateStatus(id: string, body: AdminUpdateStatusDto ): Promise<any>{
        const data = await this.mongoModel.findByIdAndUpdate(id, {
            status: body.status
        });
        return await data.populate('user').execPopulate();
    }
    
}
