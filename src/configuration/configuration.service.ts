import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QueryPaginateDto } from 'src/common/dto/paginate.dto';
import { CONFIGURATION_MODEL } from 'src/mongo-model.constance';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';
import { ConfigurationEntityDocument } from './entities/configuration.entity';

import {defaultConfig, FAKE_NUMBER_VIEW_STEP, NUMBER_OF_DATE_DELETE_VIDEO} from "./schemas/configuration.schema";

@Injectable()
export class ConfigurationService {

  constructor(
    @InjectModel( CONFIGURATION_MODEL ) private readonly configModel: Model<ConfigurationEntityDocument>,
  ){}

  async create(createConfigurationDto: CreateConfigurationDto): Promise<ConfigurationEntityDocument> {
    return await new this.configModel(createConfigurationDto).save();
  }

  async createDefaultConfig(): Promise<ConfigurationEntityDocument[]> {
    defaultConfig.forEach( async config => {
      const find = await this.configModel.findOne({ configKey: config.configKey })
      if(!find){
        await this.configModel.create(config)
      }
    })
    return await this.configModel.find({});
  }

  async findAll( query: QueryPaginateDto ): Promise<ConfigurationEntityDocument[]> {
    const data = await this.configModel.aggregate([
  
      { $sort: { "_id": -1 } },
      {
          $facet: {
              items: [{ $skip: Number(query.limit) * (Number(query.page) - 1) }, { $limit: Number(query.limit) }],
              total: [
                  {
                      $count: 'count'
                  }
              ]
          }
      }
    ]).exec();  
    return data[0];
  }

  async findOne(id: string): Promise<ConfigurationEntityDocument> {
    return await this.configModel.findById(id).exec();
  }

  async findConfigName(configKey: string): Promise<ConfigurationEntityDocument> {
    return await this.configModel.findOne({ configKey: configKey }).exec();
  }

  async getFakeNumberViewStep(): Promise<ConfigurationEntityDocument>{
    return await this.configModel.findOne({ configKey: FAKE_NUMBER_VIEW_STEP }).exec();
  }

  async getNumberOfDateDeleteVideo(): Promise<ConfigurationEntityDocument>{
    return await this.configModel.findOne({ configKey: NUMBER_OF_DATE_DELETE_VIDEO }).exec();
  }

  async update(id: string, updateConfigurationDto: UpdateConfigurationDto) {
    return await this.configModel.findByIdAndUpdate(id, updateConfigurationDto );
  }

  async remove(id: string): Promise<any> {
    return await this.configModel.findByIdAndDelete(id);
  }
}
