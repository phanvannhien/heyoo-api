import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateShopCategoryDto } from './dto/create-shop-category.dto';
import { UpdateShopCategoryDto } from './dto/update-shop.dto';
import { ShopCategoriesEntityDocument } from './entities/shop-category.entity';
import { GetShopCategoryDto } from './dto/get-shop-category.dto';


@Injectable()
export class ShopCategoriesService {

  constructor(
    @InjectModel('ShopCategories') private readonly categoryModel
  ){}

  async create(createCategoryDto: CreateShopCategoryDto): Promise<ShopCategoriesEntityDocument> {
    const i = new this.categoryModel( createCategoryDto );
    return await i.save();
  }

  async findCategoryById( id: string ){
    return await this.categoryModel.findById(id);
  }

  async findAll(): Promise<ShopCategoriesEntityDocument[]> {
    return await this.categoryModel.find().exec();
  }

  async findAllCategories(query: GetShopCategoryDto): Promise<ShopCategoriesEntityDocument[]> {

    return await this.categoryModel.find()
      .skip( Number( (query.page - 1)*query.limit ) )
      .limit( Number( query.limit ) )
      .exec();
  }

  async findOne(id: string): Promise<ShopCategoriesEntityDocument> {
    return await this.categoryModel.findById( id );
  }

  async update(id: string, updateCategoryDto: UpdateShopCategoryDto): Promise<ShopCategoriesEntityDocument> {
    return this.categoryModel.findByIdAndUpdate( id, updateCategoryDto );
  }

  async remove(id: string): Promise<any> {
    return await this.categoryModel.findByIdAndRemove(id);
  }

  async delete( id ): Promise<any> {
    // delete user
    const deleted = await this.categoryModel.deleteById(id);
    // delete livestream by user
    // await this.liveStreamService.removeLiveStreamByUser( id );
    return deleted;
  }

}
