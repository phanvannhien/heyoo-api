import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLivestreamDto } from './dto/create-livestream.dto';
import { UpdateLivestreamDto } from './dto/update-livestream.dto';
import { LiveStreamEntityDocument, LiveStreamMemberEntityDocument } from './entities/livestream.entity';
import * as mongoose from 'mongoose';
import { GetLiveStreamDto } from './dto/get-livestream.dto';
var ObjectId = mongoose.Types.ObjectId;

@Injectable()
export class LivestreamsService {

  constructor(
    @InjectModel('LiveStreams') private readonly liveStreamModel: Model<LiveStreamEntityDocument>,
    @InjectModel('LiveStreamMembers') private readonly liveStreamMemberModel: Model<LiveStreamMemberEntityDocument>,

  ){}

  async create(createLivestreamDto: CreateLivestreamDto): Promise<any> {
    const doc = new this.liveStreamModel( createLivestreamDto );
    await doc.save();
    return doc.populate('categories').populate('streamer').execPopulate();
  }

  async findAllStatus(query: GetLiveStreamDto): Promise<LiveStreamEntityDocument[]> {
    const builder = this.liveStreamModel.find();
    if(query.title) builder.where({ channelTitle: {'$regex': query.title }  });
    return await builder
      .skip( Number( (query.page - 1)*query.limit ) )
      .limit( Number( query.limit ) )
      .sort({ "_id": -1 })
      .populate(['categories','streamer'])
      .exec();
  }

  async findPaginate(query: GetLiveStreamDto): Promise<any>{
    return await this.liveStreamModel.aggregate([
        { 
          $match: {
              phone: { $regex: new RegExp( query.title, 'i' ) }
          }
        },
        {
          $lookup: {
              from: "users",
              localField: "streamer",
              foreignField: "_id",
              as: "streamer"
          }
        },
        {
          $unwind: {  path: "$streamer", preserveNullAndEmptyArrays: true }
        },
        {
            $lookup: {
                from: "categories",
                localField: "categories",
                foreignField: "_id",
                as: "categories"
            }
        },
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
}

  async findAll(): Promise<LiveStreamEntityDocument[]> {
    return await this.liveStreamModel.find({ endLiveAt: null })
      .sort({ "_id": -1 })
      .populate(['categories','streamer']).exec();
  }


  async findOne(id: string): Promise<LiveStreamEntityDocument> {
    return await this.liveStreamModel.findById(id)
      .populate('categories')
      .populate('streamer')
      .exec();
  }

  async joinMember( streamId: string, memberId: string, uid: number ): Promise<LiveStreamMemberEntityDocument>{
    const d = await this.findOne(streamId)
    if(!d) throw new BadRequestException("Live stream doest not exists")

    const mem = new this.liveStreamMemberModel({
      liveStream: streamId,
      member: memberId,
      uid: uid
    })
    await mem.save();
    return mem.populate({
      path: 'liveStream',
      populate: [{ path: 'streamer' },{ path: 'categories' }]
    }).execPopulate();
  }

  async leaveMember( liveStreamId: string, memberId: string ){ 
    const live = await this.findOne(liveStreamId)
    if(!live) throw new BadRequestException("Live stream doest not exists")

    const find = await this.liveStreamMemberModel.findOne({
      liveStream: live._id,
      member: memberId
    })
    if( !find )  throw new BadRequestException("Not join any live stream")

    find.leaveAt = new Date();
    await find.save();
    return find;

  }

  async endLiveStream(liveStreamId: string, memberId: string ): Promise<LiveStreamEntityDocument> {
    const live = await this.liveStreamModel.findById(liveStreamId).populate('categories')
      .populate('streamer')
      .exec();
    if(!live) throw new BadRequestException("Live stream doest not exists")
    if( live.streamer.id.toString() != memberId ) throw new BadRequestException("User is not a streamer")
    live.endLiveAt = new Date();
    return await live.save();
  }

  async update(id: string, updateLivestreamDto: object): Promise<LiveStreamEntityDocument> {
    return await this.liveStreamModel.findByIdAndUpdate(id, updateLivestreamDto);
    
  }

  async remove(id: string): Promise<any> {
    // remove live members item
    return await this.liveStreamModel.findByIdAndRemove( id );
  }

  async removeAll(): Promise<any>{
    const allLiveStream = await this.liveStreamModel.find({}).exec();
    if( allLiveStream.length > 0 ){
      allLiveStream.map( async i => {
        await this.liveStreamMemberModel.deleteMany({ liveStream: i.id });
      });
      await this.liveStreamModel.remove({});
      return true;
    }

  }

  async removeLiveStreamByUser( userId ){
    const allLiveStream = await this.liveStreamModel.find({ streamer: userId }).exec();
    if( allLiveStream.length > 0 ){
      allLiveStream.map( async i => {
        await this.liveStreamMemberModel.deleteMany({ liveStream: i.id });
      });
      await this.liveStreamModel.deleteMany({ streamer: userId });
      return true;
    }
    return false;  
  }

}
