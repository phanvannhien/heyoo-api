import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CONFIGURATION_MODEL } from 'src/mongo-model.constance';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';
import { ConfigurationEntityDocument } from './entities/configuration.entity';

@Injectable()
export class ConfigurationService {

  constructor(
    @InjectModel( CONFIGURATION_MODEL ) private readonly configModel: Model<ConfigurationEntityDocument>,
  ){}

  async create(createConfigurationDto: CreateConfigurationDto): Promise<ConfigurationEntityDocument> {
    return await new this.configModel(createConfigurationDto).save();
  }

  async findAll(): Promise<ConfigurationEntityDocument[]> {
    return await this.configModel.find({}).exec();
  }

  async findOne(id: string): Promise<ConfigurationEntityDocument> {
    return await this.configModel.findById(id).exec();
  }

  async findByKey(configKey: string): Promise<ConfigurationEntityDocument> {
    return await this.configModel.findOne({ configKey: configKey }).exec();
  }

  async update(id: string, updateConfigurationDto: UpdateConfigurationDto) {
    return await this.configModel.findByIdAndUpdate(id, updateConfigurationDto );
  }

  async remove(id: string): Promise<any> {
    return await this.configModel.findByIdAndDelete(id);
  }
}
