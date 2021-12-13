import { Body, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdminGetReportDto } from './dto/admin-get-report.dto';
import { CreateReportDto } from './dto/create-report.dto';
import { GetReportDto } from './dto/get-report-content.dto';
import { ReportSubject } from './schemas/report.schema';

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
    
    async remove(id: string): Promise<any> {
        return await this.model.deleteById( id );
    }

    // ADMIN
    async findAdminPaginate(query: AdminGetReportDto){
        let lookupObject = {};
        
        if( query.subject.toString() == ReportSubject.LIVESTREAM ){
            lookupObject = {
                from: "livestreams",
                localField: "reportSubjectId",
                foreignField: "_id",
                as: "reportObject"
            }
        }
        if( query.subject.toString() === ReportSubject.SHOP ){
    
            lookupObject = {
                from: "shops",
                localField: "reportSubjectId",
                foreignField: "_id",
                as: "reportObject"
            }

        }
        if( query.subject.toString() == ReportSubject.USER ){
            lookupObject = {
                from: "users",
                localField: "reportSubjectId",
                foreignField: "_id",
                as: "reportObject"
            }
        }
        if( query.subject.toString() == ReportSubject.NEWS ){
            lookupObject = {
                from: "news",
                localField: "reportSubjectId",
                foreignField: "_id",
                as: "reportObject"
            }
        }
        if( query.subject.toString() == ReportSubject.VIDEOS ){
            lookupObject = {
                from: "videos",
                localField: "reportSubjectId",
                foreignField: "_id",
                as: "reportObject"
            }
        }
        if( query.subject.toString() == ReportSubject.POST ){
            lookupObject = {
                from: "user_walls",
                localField: "reportSubjectId",
                foreignField: "_id",
                as: "reportObject"
            }
        }
        if( query.subject.toString() == ReportSubject.PRODUCT ){
            lookupObject = {
                from: "shop_products",
                localField: "reportSubjectId",
                foreignField: "_id",
                as: "reportObject"
            }
        }
    

        const docsPromise = this.model.aggregate([
            {
                $match: { subject: query.subject }
            },
      
            {
                $lookup:
                {
                    from: "users",
                    localField: "reportBy",
                    foreignField: "_id",
                    as: "reportBy"
                }
            },
            {
                $lookup:
                {
                    from: "report_contents",
                    localField: "reportContentId",
                    foreignField: "_id",
                    as: "reportContent"
                }
            },

            {
                $lookup: lookupObject
            },

            {
                $unwind: {  path: "$reportBy", preserveNullAndEmptyArrays: true }
            },
            {
                $unwind: {  path: "$reportContent", preserveNullAndEmptyArrays: true }
            },
            {
                $unwind: {  path: "$reportObject", preserveNullAndEmptyArrays: true }
            },

            { $sort: { "_id": -1 } },
            { $limit: Number(query.limit) },
            { $skip:  Number(query.limit) * (Number(query.page) - 1) }
          ]).exec();
   
        const countPromise = this.model.countDocuments({
            subject: query.subject
        });

        const [total, items] = await Promise.all([countPromise, docsPromise]);
      
        return {
            total,
            items
        }
    }
}
