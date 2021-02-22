import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLivestreamDto } from './dto/create-livestream.dto';
import { UpdateLivestreamDto } from './dto/update-livestream.dto';
import { LiveStreamEntityDocument } from './entities/livestream.entity';

@Injectable()
export class LivestreamsService {

  constructor(
    @InjectModel('LiveStreams') private readonly liveStreamModel: Model<LiveStreamEntityDocument>
  ){}

  async create(createLivestreamDto: CreateLivestreamDto): Promise<LiveStreamEntityDocument> {
    const doc = new this.liveStreamModel( createLivestreamDto );
    return await doc.save();
  }

  async findAll(): Promise<LiveStreamEntityDocument[]> {
    return await this.liveStreamModel.find().populate('categories').exec();
  }

  async findOne(id: string): Promise<any> {
    return await this.liveStreamModel.findById(id)
      .populate(['categories','streamer'])
      .exec();
  }

  update(id: number, updateLivestreamDto: UpdateLivestreamDto) {
    return `This action updates a #${id} livestream`;
  }

  async remove(id: string): Promise<any> {
    return await this.liveStreamModel.findByIdAndRemove( id );
  }
}
