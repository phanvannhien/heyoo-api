import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateReportDto } from './dto/create-report.dto';
import { GetReportDto } from './dto/get-report-content.dto';

@Injectable()
export class ReportService {
    constructor(
        @InjectModel('Report') private readonly model,
    ){}

    async create( createDto: CreateReportDto): Promise<any> {
        const doc = new this.model( createDto );
        return await doc.save();
    }

    async findById( id: string ): Promise<any> {
        return await this.model.findById(id).exec();
    }

    async findPaginate(query: GetReportDto){
        const countPromise = this.model.countDocuments();
        const docsPromise = this.model.find(query)
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
    
    async remove(id: string): Promise<any> {
        return await this.model.deleteById( id );
    }

}
