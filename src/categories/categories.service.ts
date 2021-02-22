import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesEntityDocument } from './entities/category.entity';


@Injectable()
export class CategoriesService {

  constructor(
    @InjectModel('Categories') private readonly categoryModel: Model<CategoriesEntityDocument>
  ){}

  async create(createCategoryDto: CreateCategoryDto): Promise<CategoriesEntityDocument> {
    const i = new this.categoryModel( createCategoryDto );
    return await i.save();
  }

  async findAll(): Promise<CategoriesEntityDocument[]> {
    return await this.categoryModel.find().exec();
  }

  async findOne(id: string): Promise<CategoriesEntityDocument> {
    return await this.categoryModel.findById( id );
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<CategoriesEntityDocument> {
    return this.categoryModel.findByIdAndUpdate( id, updateCategoryDto );
  }

  async remove(id: string): Promise<any> {
    return await this.categoryModel.findByIdAndRemove(id);
  }
}
