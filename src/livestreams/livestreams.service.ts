import { BadRequestException, HttpService, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLivestreamDto } from './dto/create-livestream.dto';
import { UpdateLivestreamDto } from './dto/update-livestream.dto';
import { LiveStreamEntityDocument, LiveStreamMemberEntityDocument } from './entities/livestream.entity';
import * as mongoose from 'mongoose';
import { GetLiveStreamDto } from './dto/get-livestream.dto';
import { AgoraService } from 'src/agora/agora.service';
import { AdminGetLiveStreamDto } from './dto/admin-get-livestream.dto';
import * as moment from 'moment';
import { DuetLiveStreamEntityDocument } from './entities/duet.entity';


var ObjectId = mongoose.Types.ObjectId;
const crypto = require('crypto');


@Injectable()
export class LivestreamsService {

  constructor(
    @InjectModel('LiveStreams') private readonly liveStreamModel,
    @InjectModel('LiveStreamMembers') private readonly liveStreamMemberModel: Model<LiveStreamMemberEntityDocument>,
    @InjectModel('Duet') private readonly duetModel: Model<DuetLiveStreamEntityDocument>,
    private httpService: HttpService,
    private readonly agoraService: AgoraService,
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
            channelTitle: { $regex: new RegExp( query.title, 'i' ) },
            shop: null
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
    return await this.liveStreamModel.find(
        { endLiveAt: null, shop: null }
      )
      .sort({ "_id": -1 })
      .populate(['categories','streamer']).exec();
  }

  async findAllShopLiveStreamAfter7Days(): Promise<LiveStreamEntityDocument[]> {
    return await this.liveStreamModel.find(
        { 
          // $and: [ {shop:{$exists: true}}, {shop:{ $ne : null}} ],
          shop:{ $ne: null },
          createdAt: { 
            $lt: new Date(new Date().setDate(new Date().getDate() - 7 ))
          }
        }
      ).exec();
  }


  async findOne(id: string): Promise<LiveStreamEntityDocument> {
    return await this.liveStreamModel.findById(id)
      .populate('categories')
      .populate('streamer')
      .exec();
  }

  async joinMember( liveStream: LiveStreamEntityDocument, memberId: string, uid: number ): Promise<LiveStreamMemberEntityDocument>{
    
    const mem = new this.liveStreamMemberModel({
      liveStream: liveStream.id,
      member: memberId,
      uid: uid
    })
    return await mem.save();
   
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

  async acquireRecordVideo( liveStream: LiveStreamEntityDocument ): Promise<any>{
    const Authorization =  `Basic ${Buffer.from(`${process.env.AGORA_CUSTOMER_ID}:${process.env.AGORA_CUSTOMER_SECRET}`).toString("base64")}`;
    const agoraRecordUid = crypto.randomBytes(4).readUInt32BE(0, true);

    try{
      const response = await this.httpService.post(`https://api.agora.io/v1/apps/${process.env.AGORA_APP_ID}/cloud_recording/acquire`,
        {
          cname: liveStream.channelName,
          uid: agoraRecordUid.toString() ,
          clientRequest: {
            resourceExpiredHour: 24, // Sets the time limit (in hours) for Cloud Recording RESTful API calls. Time starts counting when you successfully start a cloud recording and get an sid (the recording ID).
            scene: 0 //  Sets the recording options.0(default) indicates allocating resources for video and audio recording in a channel.
          }
        },
        { 
          headers: { Authorization } 
        }
      ).toPromise();

      await this.liveStreamModel.findByIdAndUpdate( liveStream.id, {
        agoraResourceId: response.data.resourceId,
        agoraRecordUid: agoraRecordUid
      });

      // return await this.startRecordIndividualVideo( liveStream, response.data.resourceId, agoraRecordUid );
      return await this.startRecordVideo( liveStream, response.data.resourceId, agoraRecordUid );

    }catch(e){
      return e;
    }
    
  }

  async startRecordVideo(liveStream: LiveStreamEntityDocument, agoraResourceId, agoraRecordUid ): Promise<any>{
    const Authorization =  `Basic ${Buffer.from(`${process.env.AGORA_CUSTOMER_ID}:${process.env.AGORA_CUSTOMER_SECRET}`).toString("base64")}`;
    const tokenStart = await this.agoraService.generateAgoraToken( liveStream.channelName , agoraRecordUid );

    const requestData = {
      cname: liveStream.channelName,
      uid: agoraRecordUid.toString(),
      clientRequest: {
        token: tokenStart,

        recordingConfig: {
          channelType: 1, // 0: (Default) Communication profile. 1: Live broadcast profile.
          streamTypes: 2, // 2: (Default) Subscribes to both audio and video streams. 1: Subscribes to video streams only.
          videoStreamType: 0,  // 0: (Default) Subscribes to the high-quality stream. 1: Subscribes to the low-quality stream.
          maxIdleTime: 600, // Cloud recording automatically stops recording and leaves the channel when there is no user in the channel after a period (in seconds) set by this parameter. The value range is from 5 to 2^32-1
          // audioProfile: 1,
     
          "transcodingConfig":{
            "width": 1080,
            "height": 1920,
            "fps": 60,
            "bitrate": 6500,

            "maxResolutionUid": liveStream.streamerUid.toString(),
            // (Optional) String. When mixedVideoLayout is set as 2 (vertical layout), you can specify the UID of the large video window by this parameter.

            "mixedVideoLayout": 0,
            // 0: (Default) Floating layout. The first user in the channel occupies the full canvas. The other users occupy the small regions on top of the canvas, starting from the bottom left corner. The small regions are arranged in the order of the users joining the channel. This layout supports one full-size region and up to four rows of small regions on top with four regions per row, comprising 17 users.
            // 1: Best fit layout. This is a grid layout. The number of columns and rows and the grid size vary depending on the number of users in the channel. This layout supports up to 17 users.
            // 2: Vertical layout. One large region is displayed on the left edge of the canvas, and several smaller regions are displayed along the right edge of the canvas. The space on the right supports up to 2 columns of small regions with 8 regions per column. This layout supports up to 17 users. When mixedVideoLayout is set as 2, you can specify the UID of the large video window by maxResolutionUid.
            // 3: Customized layout. Set the layoutConfig parameter to customize the layout.

           
            backgroundColor: "#FFFFFF",
          },

          subscribeVideoUids: [liveStream.streamerUid.toString()], // only streamer
          subscribeAudioUids: [liveStream.streamerUid.toString()], // only streamer
          subscribeUidGroup: 0

        },

        recordingFileConfig: {

          avFileType: ["hls"],
          // "hls": (Default) M3U8 and TS files.
          // "mp4": MP4 files. This value is for composite recording (mix) and web page recording (web) only and must be set together with "hls"; otherwise, the recording service returns error code 2. When the length of the recorded file reaches approximately two hours, or when the size of the file exceeds approximately 2 GB, the recording service automatically creates an additional MP4 file.

        },

        storageConfig: {
          vendor: 1, // Amazon S3
          region: 8, // AP_SOUTHEAST_1
          bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
          accessKey: process.env.AWS_ACCESS_KEY_ID,
          secretKey: process.env.AWS_SECRET_ACCESS_KEY,
          fileNamePrefix: ["videos", liveStream.shop.toString(), liveStream.streamerUid.toString()  ],
        },
      },
    }

    try{
      const url = `https://api.agora.io/v1/apps/${process.env.AGORA_APP_ID}/cloud_recording/resourceid/${agoraResourceId}/mode/mix/start`;
      const response = await this.httpService.post(url,
        requestData,
        { 
          headers: { Authorization } 
        }
      ).toPromise()
      
      return  await this.liveStreamModel.findByIdAndUpdate( liveStream.id, {
        agoraSid: response.data.sid
      })
    }catch(e){
      return e;
    }

  }

  async stopRecordVideo(liveStream:LiveStreamEntityDocument): Promise<any>{
    try{
      const Authorization =  `Basic ${Buffer.from(`${process.env.AGORA_CUSTOMER_ID}:${process.env.AGORA_CUSTOMER_SECRET}`).toString("base64")}`;
      const response = await this.httpService.post(`https://api.agora.io/v1/apps/${process.env.AGORA_APP_ID}/cloud_recording/resourceid/${liveStream.agoraResourceId}/sid/${liveStream.agoraSid}/mode/mix/stop`,
        {
          cname: liveStream.channelName,
          uid: liveStream.agoraRecordUid.toString(),
          clientRequest: {
            async_stop: true
          }
        },
        { 
          headers: { Authorization }
        }
      ).toPromise();

      return  await this.liveStreamModel.findByIdAndUpdate( liveStream.id, {
        videoUrl: `${process.env.CLOUD_FRONT_VIDEO_URL}/videos/${liveStream.shop}/${liveStream.streamerUid}/${liveStream.agoraSid}_${liveStream.channelName}.m3u8`
      });

    }catch(e){
      return e;
    }
  }

  async getRecordStatus(liveStream:LiveStreamEntityDocument){
    try{
      const Authorization =  `Basic ${Buffer.from(`${process.env.AGORA_CUSTOMER_ID}:${process.env.AGORA_CUSTOMER_SECRET}`).toString("base64")}`;
      const url = `https://api.agora.io/v1/apps/${process.env.AGORA_APP_ID}/cloud_recording/resourceid/${liveStream.agoraResourceId}/sid/${liveStream.agoraSid}/mode/mix/query`;
      return url;
      const response = await this.httpService.get(url,
        { 
          headers: { Authorization }
        }
      ).toPromise();
      return response;

    }catch(e){
      return e;
     }
  }

  async startRecordIndividualVideo(liveStream: LiveStreamEntityDocument, agoraResourceId, agoraRecordUid  ): Promise<any>{
    const Authorization =  `Basic ${Buffer.from(`${process.env.AGORA_CUSTOMER_ID}:${process.env.AGORA_CUSTOMER_SECRET}`).toString("base64")}`;
 
    const tokenStart = await this.agoraService.generateAgoraToken( liveStream.channelName , agoraRecordUid );
    const requestData = {
      cname: liveStream.channelName ,
      uid: agoraRecordUid.toString() ,

      clientRequest: {
        token: tokenStart,
        appsCollection: {
          combinationPolicy: "postpone_transcoding"
        },
        recordingConfig: {
          channelType: 1, // 0: (Default) Communication profile. 1: Live broadcast profile.
          streamTypes: 2, // 2: (Default) Subscribes to both audio and video streams. 1: Subscribes to video streams only.
          videoStreamType: 1,  // 0: (Default) Subscribes to the high-quality stream. 1: Subscribes to the low-quality stream.
          maxIdleTime: 30, // Cloud recording automatically stops recording and leaves the channel when there is no user in the channel after a period (in seconds) set by this parameter. The value range is from 5 to 2^32-1
          // audioProfile: 1,
          subscribeVideoUids: [liveStream.streamerUid.toString()],
          subscribeAudioUids: [liveStream.streamerUid.toString()],
          subscribeUidGroup: 0
        },

        recordingFileConfig: {
          avFileType: ["hls"],
        },

        storageConfig: {
          vendor: 1, // Amazon S3
          region: 8, // AP_SOUTHEAST_1
          bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
          accessKey: process.env.AWS_ACCESS_KEY_ID,
          secretKey: process.env.AWS_SECRET_ACCESS_KEY,
          fileNamePrefix: [ liveStream.shop.toString(), liveStream.streamerUid.toString() ],
        },

      },
    };

    try{
      const response = await this.httpService.post(`https://api.agora.io/v1/apps/${process.env.AGORA_APP_ID}/cloud_recording/resourceid/${agoraResourceId}/mode/individual/start`,
        requestData,
        { 
          headers: { Authorization } 
        }
      ).toPromise()
      
      return  await this.liveStreamModel.findByIdAndUpdate( liveStream.id, {
        agoraSid: response.data.sid
      })
    }catch(e){
      return e;
    }
  }

  async getRecordIndividualStatus(liveStream:LiveStreamEntityDocument): Promise<any>{
    try{
      const Authorization =  `Basic ${Buffer.from(`${process.env.AGORA_CUSTOMER_ID}:${process.env.AGORA_CUSTOMER_SECRET}`).toString("base64")}`;
      const url = `https://api.agora.io/v1/apps/${process.env.AGORA_APP_ID}/cloud_recording/resourceid/${liveStream.agoraResourceId}/sid/${liveStream.agoraSid}/mode/individual/query`;
      return (url);
      const response = await this.httpService.get(
        url,
        { 
          headers: { Authorization }
        }
      ).toPromise();

      return  response;

    }catch(e){
      return e;
    }
  }

  async stopRecordIndividualVideo(liveStream:LiveStreamEntityDocument): Promise<any>{
    try{
      const Authorization =  `Basic ${Buffer.from(`${process.env.AGORA_CUSTOMER_ID}:${process.env.AGORA_CUSTOMER_SECRET}`).toString("base64")}`;
      const response = await this.httpService.post(`https://api.agora.io/v1/apps/${process.env.AGORA_APP_ID}/cloud_recording/resourceid/${liveStream.agoraResourceId}/sid/${liveStream.agoraSid}/mode/individual/stop`,
        {
          cname: liveStream.channelName,
          uid: liveStream.agoraRecordUid.toString(),
          clientRequest: {
            async_stop: true
          }
        },
        { 
          headers: { Authorization }
        }
      ).toPromise();

      return  await this.liveStreamModel.findByIdAndUpdate( liveStream.id, {
        agoraFileList: response.data.serverResponse.fileList,
        videoUrl: response.data.serverResponse.fileList,
      });

    }catch(e){
      return e;
    }
  }

  async forceEndUserLiveStream( user ): Promise<any>{

    const allLive = await this.liveStreamModel.find({
      streamer: user,
      endLiveAt: { $exists: false }
    })

    // stop all shop record video
    allLive.forEach( async live => {
      if( live.shop && live.shop != '' ){
        await this.stopRecordVideo( live );
      }
    })

    return await this.liveStreamModel.updateMany({
      streamer: user,
      endLiveAt: { $exists: false }
    },{
      endLiveAt: new Date()
    });

  }

  async resetDuetLiveStreamData( liveStreamId: string ): Promise<LiveStreamEntityDocument> {
    return await this.liveStreamModel.findByIdAndUpdate(liveStreamId, {
      duetGuestId: '',
      duetGuestUid: ''
    });
  }

  /**
   * ADMIN API
   */

  async findAdminPaginate(query: AdminGetLiveStreamDto): Promise<any>{
    let match = {};
    if(query.title){
      match['channelTitle'] = { $regex: new RegExp( query.title, 'i' ) };
    }

    if(query.isLiveNow){
      match['endLiveAt'] = { $exists: false };
    }

    return await this.liveStreamModel.aggregate([
        { 
          $match: match
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

  async forceEndLiveStream( id: string ): Promise<LiveStreamEntityDocument>{
    return await this.liveStreamModel.findByIdAndUpdate(id, {
      endLiveAt: new Date()
    }, { new: true });
  }


  async delete( id ): Promise<any> {
    // delete user
    const deleted = await this.liveStreamModel.deleteById(id);
    // delete livestream by user
    // await this.liveStreamService.removeLiveStreamByUser( id );
    return deleted;
  }

}
