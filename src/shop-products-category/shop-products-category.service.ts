import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateShopProductCategoryDto } from './dto/create-shop-products-category.dto';
import { UpdateShopProductCategoryDto } from './dto/update-shop-products-category.dto';
import { ShopProductCategoryEntityDocument } from './entities/shop-products-category.entity';
import { GetShopProductCategoryDto } from './dto/get-shop-products-category.dto';


@Injectable()
export class ShopProductCategoryService {

  constructor(
    @InjectModel('ShopProductCategories') private readonly categoryModel: Model<ShopProductCategoryEntityDocument>
  ){}

  async create(createCategoryDto: CreateShopProductCategoryDto): Promise<ShopProductCategoryEntityDocument> {
    const i = new this.categoryModel( createCategoryDto );
    return await i.save();
  }

  async findCategoryById( id: string ){
    return await this.categoryModel.findById(id);
  }

  async findAll(): Promise<ShopProductCategoryEntityDocument[]> {
    return await this.categoryModel.find().exec();
  }

  async findAllCategories(query: GetShopProductCategoryDto): Promise<ShopProductCategoryEntityDocument[]> {

    return await this.categoryModel.find()
      .skip( Number( (query.page - 1)*query.limit ) )
      .limit( Number( query.limit ) )
      .exec();
  }

  async findOne(id: string): Promise<ShopProductCategoryEntityDocument> {
    return await this.categoryModel.findById( id );
  }

  async update(id: string, updateCategoryDto: UpdateShopProductCategoryDto): Promise<ShopProductCategoryEntityDocument> {
    return this.categoryModel.findByIdAndUpdate( id, updateCategoryDto );
  }

  async remove(id: string): Promise<any> {
    return await this.categoryModel.findByIdAndRemove(id);
  }
}
