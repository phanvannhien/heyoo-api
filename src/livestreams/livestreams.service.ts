import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLivestreamDto } from './dto/create-livestream.dto';
import { UpdateLivestreamDto } from './dto/update-livestream.dto';
import { LiveStreamEntityDocument, LiveStreamMemberEntityDocument } from './entities/livestream.entity';
import * as mongoose from 'mongoose';
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

  async findAll(): Promise<LiveStreamEntityDocument[]> {
    return await this.liveStreamModel.find({ endLiveAt: null })
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
    const live = await this.findOne(liveStreamId)
    if(!live) throw new BadRequestException("Live stream doest not exists")
    if( live.streamer != memberId ) throw new BadRequestException("User is not a streamer")
    live.endLiveAt = new Date();
    return await live.save();
  }

  update(id: number, updateLivestreamDto: UpdateLivestreamDto) {
    return `This action updates a #${id} livestream`;
  }

  async remove(id: string): Promise<any> {
    // remove live members item
    await this.liveStreamMemberModel.deleteMany({liveStream: id});
    return await this.liveStreamModel.findByIdAndRemove( id );
  }
}
