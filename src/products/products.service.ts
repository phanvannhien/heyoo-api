import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductEntityDocument } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductDto } from './dto/get-product.dto';

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel('Product') private readonly productModel: Model<ProductEntityDocument>,
    ){}

    async create( createDto: CreateProductDto): Promise<any> {
        const doc = new this.productModel( createDto );
        return await doc.save();
    }

    async findById( id: string ): Promise<any> {
        return await this.productModel.findById(id).exec();
    }

    async getAll(): Promise<ProductEntityDocument[]> {
        return await this.productModel.find()
            .sort({ price: -1 })
            .exec();
    }

    async findAll(query: GetProductDto): Promise<ProductEntityDocument[]> {
        return await this.productModel.find()
            .sort({ productName: 1 })
            .skip( Number( (query.page - 1)*query.limit ) )
            .limit( Number( query.limit ) )
            .exec();
    }

    async update(id: string, updateDto: UpdateProductDto): Promise<any>  {
        return await this.productModel.findByIdAndUpdate( id, updateDto );
    }
    
    async remove(id: string): Promise<any> {
        return await this.productModel.findByIdAndRemove( id );
    }
}
