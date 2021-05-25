import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNewsCategoryDto } from './dto/create-news-category.dto';
import { UpdateNewsCategoryDto } from './dto/update-category.dto';
import { NewsCategoriesEntityDocument } from './entities/news-category.entity';
import { GetNewsCategoryDto } from './dto/get-news-category.dto';


@Injectable()
export class NewsCategoriesService {

  constructor(
    @InjectModel('NewsCategories') private readonly newsCategoryModel: Model<NewsCategoriesEntityDocument>
  ){}

  async create(createCategoryDto: CreateNewsCategoryDto): Promise<NewsCategoriesEntityDocument> {
    const i = new this.newsCategoryModel( createCategoryDto );
    return await i.save();
  }

  async findCategoryById( id: string ){
    return await this.newsCategoryModel.findById(id);
  }

  async findAll(): Promise<NewsCategoriesEntityDocument[]> {
    return await this.newsCategoryModel.find().exec();
  }

  async findAllCategories(query: GetNewsCategoryDto): Promise<NewsCategoriesEntityDocument[]> {

    return await this.newsCategoryModel.find()
      .skip( Number( (query.page - 1)*query.limit ) )
      .limit( Number( query.limit ) )
      .exec();
  }

  async findOne(id: string): Promise<NewsCategoriesEntityDocument> {
    return await this.newsCategoryModel.findById( id );
  }

  async update(id: string, updateCategoryDto: UpdateNewsCategoryDto): Promise<NewsCategoriesEntityDocument> {
    return this.newsCategoryModel.findByIdAndUpdate( id, updateCategoryDto );
  }

  async remove(id: string): Promise<any> {
    return await this.newsCategoryModel.findByIdAndRemove(id);
  }
}
