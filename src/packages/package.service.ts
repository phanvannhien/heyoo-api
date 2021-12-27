import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PackageEntityDocument } from './entities/package.entity';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { GetPackageDto } from './dto/get-package.dto';

@Injectable()
export class PackageService {
    constructor(
        @InjectModel('Package') private readonly productModel,
    ){}

    async create( createDto: CreatePackageDto): Promise<any> {
        const doc = new this.productModel( createDto );
        return await doc.save();
    }

    async findById( id: string ): Promise<any> {
        return await this.productModel.findById(id).exec();
    }

    async getAll(): Promise<PackageEntityDocument[]> {
        return await this.productModel.find()
            .sort({ price: 1 })
            .exec();
    }

    async findPaginate(query: GetPackageDto): Promise<any> {
        const countPromise = this.productModel.countDocuments();
        const docsPromise = this.productModel.find()
            .sort({ price: 1 })
            .skip( Number( (query.page - 1) * query.limit ) )
            .limit( Number( query.limit ) )
            .exec();
        const [total, items] = await Promise.all([countPromise, docsPromise]);
        return {
          total,
          items
        }
    }

    async update(id: string, updateDto: UpdatePackageDto): Promise<any>  {
        return await this.productModel.findByIdAndUpdate( id, updateDto );
    }
    
    async remove(id: string): Promise<any> {
        return await this.productModel.deleteById( id );
    }
}
