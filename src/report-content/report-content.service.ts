import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateReportContentDto } from './dto/create-report-content.dto';
import { UpdateReportContentDto } from './dto/update-report-content.dto';
import { ReportContentEntityDocument } from './entities/report-content.entity';

@Injectable()
export class ReportContentService {
  constructor(@InjectModel('ReportContent') private readonly model: Model<ReportContentEntityDocument>){

  }
  
  async create(createDto: CreateReportContentDto): Promise<ReportContentEntityDocument> {
    const role = new this.model( createDto );
    return await role.save();
  }

  async findAll(): Promise<ReportContentEntityDocument[]> {
    return await this.model.find({});
  }

  async findById(id: string): Promise<ReportContentEntityDocument>  {
    return await this.model.findById( id );
  }

  async update(id: string, updateRoleDto: UpdateReportContentDto): Promise<ReportContentEntityDocument>   {
    return await this.model.findByIdAndUpdate( id, updateRoleDto );
  }

  async remove(id: string): Promise<ReportContentEntityDocument>  {
    return await this.model.findByIdAndDelete(id);
  }
}
