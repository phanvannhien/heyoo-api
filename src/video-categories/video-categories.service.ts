import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateVideoCategoryDto } from './dto/create-video-category.dto';
import { UpdateVideoCategoryDto } from './dto/update-video.dto';
import { VideoCategoriesEntityDocument } from './entities/video-category.entity';
import { GetVideoCategoryDto } from './dto/get-video-category.dto';


@Injectable()
export class VideoCategoriesService {

  constructor(
    @InjectModel('VideoCategories') private readonly categoryModel: Model<VideoCategoriesEntityDocument>
  ){}

  async create(createCategoryDto: CreateVideoCategoryDto): Promise<VideoCategoriesEntityDocument> {
    const i = new this.categoryModel( createCategoryDto );
    return await i.save();
  }

  async findCategoryById( id: string ){
    return await this.categoryModel.findById(id);
  }

  async findAll(): Promise<VideoCategoriesEntityDocument[]> {
    return await this.categoryModel.find().exec();
  }

  async findAllCategories(query: GetVideoCategoryDto): Promise<VideoCategoriesEntityDocument[]> {
    return await this.categoryModel.find()
      .skip( Number( (query.page - 1)*query.limit ) )
      .limit( Number( query.limit ) )
      .exec();
  }

  async findOne(id: string): Promise<VideoCategoriesEntityDocument> {
    return await this.categoryModel.findById( id );
  }

  async update(id: string, updateCategoryDto: UpdateVideoCategoryDto): Promise<VideoCategoriesEntityDocument> {
    return this.categoryModel.findByIdAndUpdate( id, updateCategoryDto );
  }

  async remove(id: string): Promise<any> {
    return await this.categoryModel.findByIdAndRemove(id);
  }
}
