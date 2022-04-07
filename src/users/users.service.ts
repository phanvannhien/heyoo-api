import { 
    Injectable, BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { FilesService } from 'src/files/files.service';
import { LevelService } from 'src/level/level.service';
import { LivestreamsService } from 'src/livestreams/livestreams.service';
import { FindUserDto } from './dto/find-user.dto';
import { User } from './interfaces/user.interface';
import { GetUserDto } from './dto/get-users.dto';
import { FollowEntityDocument } from './interfaces/follow.entity';
import { GetFollowerDto } from './dto/getfollower.dto';
import { GetFollowingDto } from './dto/getfollowing.dto';
import * as mongoose from 'mongoose';
import { SearchIdoDto } from './dto/search-ido.dto';
import { QueryPaginateDto } from 'src/common/dto/paginate.dto';
import { LoginSocialDto } from 'src/auth/dto/login-social.dto';
import { RegisterFcmTokenDto } from './dto/register-fcmtoken.dto';
import { USER_FCMTOKEN_MODEL } from 'src/mongo-model.constance';
import { UserFcmTokenEntityDocument } from './interfaces/fcm-token.entity';
import { FirebaseCloudMessageService, INotifyMessageBody } from 'src/firebase/firebase.service';
import { CreateWithDrawDto } from './dto/withdraw.dto';
import { GetWithDrawDto } from './dto/get-withdraw.dto';
import { AdminGetWithDrawDto } from './dto/admin-get-withdraw.dto';
import { AdminUpdateWithDrawDto } from './dto/update-withdraw-status.dto';
import { WithDrawStatus } from './schemas/withdraw.schema';

@Injectable()
export class UsersService {


    constructor(
        @InjectModel('User') private readonly userModel,
        @InjectModel('WithDraw') private readonly withDrawModel,
        @InjectModel('Follow') private readonly followModel: Model<FollowEntityDocument>,
        @InjectModel( USER_FCMTOKEN_MODEL ) private readonly fcmTokenModel: Model<UserFcmTokenEntityDocument>,
        private readonly filesService: FilesService,
        private readonly liveStreamService: LivestreamsService,
        private readonly firebaseService: FirebaseCloudMessageService,
        private readonly levelService: LevelService,
    ){

    }

    async findPaginate(query: GetUserDto): Promise<any>{
        let docsQuery = {}
        if(query.phone){
            query.phone = query.phone.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
            docsQuery =  {
                phone: {  $regex: new RegExp( query.phone, 'i' ) }
            }
        }
  
        const countPromise = this.userModel.countDocuments(docsQuery);
        const docsPromise = this.userModel.find(docsQuery)
            .sort('-_id')
            .skip( Number( (query.page - 1) * query.limit ) )
            .limit( Number( query.limit ) )
            .exec();
    
        const [total, items] = await Promise.all([countPromise, docsPromise]);

        return {
          total,
          items
        }

        // return await this.userModel.aggregate([
        //     { 
        //         $match: {
        //             phone: {  $regex: new RegExp( query.phone, 'i' ) }
        //         }
        //     },
        //     {
        //         $facet: {
        //             items: [{ $skip: Number(query.limit) * (Number(query.page) - 1) }, { $limit: Number(query.limit) }],
        //             total: [
        //                 {
        //                     $count: 'count'
        //                 }
        //             ]
        //         }
        //     }
        // ]).exec();
    }

    async find(): Promise<User[]>{
        return await this.userModel.find().exec();
    }

    async findUsersByIds( ids: string[] ): Promise<User[]>{
        return  await this.userModel.find({
            _id: { $in: ids }
        }).exec()
    }

    async findAll( query: GetUserDto ): Promise<User[]> {
        const builder = this.userModel.find();
        if( query.phone ) builder.where({ phone: query.phone });
        return await builder.limit( Number(query.limit) )
            .skip( Number(query.limit * (query.page - 1)) )
            .exec();
    }

    async findOne( findUser: FindUserDto ):  Promise<User> {
        return this.userModel.findOne(findUser).exec();
    }

    async findSocialUser( findUser ):  Promise<User> {
        return this.userModel.findOne(findUser).exec();
    }

    async findByPhone( phone: string) : Promise<User>{
        return await this.userModel.findOne({ phone: phone }).exec()
    }
 
    async findById( id: string) : Promise<User>{
        return await this.userModel.findById(id).exec()
    }

    async findOrCreateFacebookId( socialProfile: any ) : Promise<User>{
        const user = await this.userModel.findOne({ 'facebook.id': socialProfile.id }).exec();
        if( user ) return user;

        const defaultLevel = await this.levelService.getMinLevel();

        const createUser = new this.userModel({
            fullname: socialProfile.name || 'No name',
            email: socialProfile.email,
            avatar: socialProfile.picture.data.url || '',
            isVerified: true,
            facebook: {
                id: socialProfile.id
            },
            userLevel: defaultLevel? defaultLevel.id : ''
        });

        return await createUser.save();
    } 


    async findOrCreateGoogleId( socialProfile: any ) : Promise<User>{
        const user = await this.userModel.findOne({ 'google.id': socialProfile.sub }).exec();
        if( user ) return user;

        const defaultLevel = await this.levelService.getMinLevel();
        const createUser = new this.userModel({
            fullname: socialProfile.name || '',
            email: socialProfile.email,
            avatar: socialProfile.picture || '',
            isVerified: true,
            google: {
                id: socialProfile.sub,
            },
            userLevel: defaultLevel? defaultLevel.id : ''
        });
    
        return await createUser.save();
    }

    async findOrCreateAppleId( socialProfile: any ) : Promise<User>{
        const user = await this.userModel.findOne({ 'apple.id': socialProfile.sub }).exec();
        if( user ) return user;

        const defaultLevel = await this.levelService.getMinLevel();
        const createUser = new this.userModel({
            fullname: 'No name',
            email: socialProfile.email,
            avatar: '',
            isVerified: true,
            apple: {
                id: socialProfile.sub,
            },
            userLevel: defaultLevel? defaultLevel.id : ''
        });
        return await createUser.save();

    }

    async createUser( registerDto: RegisterDto ) : Promise<User>{
        registerDto.isVerified =  true;
        const defaultLevel = await this.levelService.getMinLevel();
        registerDto.userLevel = defaultLevel? defaultLevel.id : '';
        const createdUser = new this.userModel(registerDto);
        
        return await createdUser.save();
    }
    
    async updateUser( id , data ): Promise<User> {
        const updated = await this.userModel
            .findByIdAndUpdate(id, data, { new: true });
        return updated;
    }

    async updateAvatar(userId: string, imageBuffer: Buffer, filename: string): Promise<User> {
        const avatar = await this.filesService.uploadPublicFile(imageBuffer, filename);
        const user = await this.updateUser(userId, {
            avatar: avatar
        });
        return user;
    }

    async delete( id ): Promise<any> {
        // delete user
        const deleted = await this.userModel.deleteById(id);
        // delete livestream by user
        // await this.liveStreamService.removeLiveStreamByUser( id );
        return deleted;
    }

    async doFollow(userId, followUser): Promise<any>{
        const findFollowUser = await this.userModel.findById(followUser);
        if (!findFollowUser) throw new BadRequestException('User not found');
        const followExist = await this.followModel.findOne({
            user: userId,
            follow: followUser
        }).exec()

        if (followExist) return await followExist.populate('user').populate('follow').execPopulate()

        const n = await this.followModel.create({
            user: userId,
            follow: followUser
        })
        return await n.populate('user').populate('follow').execPopulate()
    }

    async unFollow(userId, followUser): Promise<any>{
        await this.followModel.findOneAndDelete({
            user: userId,
            follow: followUser
        }).exec()
        return true
    }

    // Lấy danh sách user ids đang theo dõi của userId 
    async getUserIdsFollower(userId): Promise<any>{
        const findFollowUser = await this.userModel.findById(userId);
        if (!findFollowUser) throw new BadRequestException('User not found');

        return await this.followModel.find({
            follow: userId
        }).select('user').distinct('user').exec();
    }

    // Lấy danh sách user đang theo dõi của userId 
    async getFollower(userId, query: GetFollowerDto): Promise<any>{
        const findFollowUser = await this.userModel.findById(userId);
        if (!findFollowUser) throw new BadRequestException('User not found');

        return await this.followModel.find({
            follow: userId
        }).populate('user')
            .populate('follow')
            .sort({ createdAt: -1 })
            .skip( Number( (query.page - 1)*query.limit ) )
            .limit( Number( query.limit ) )
            .exec()
    }

    // Lấy danh sách user mà userId đang theo dõi
    async getFollowing(userId, query: GetFollowingDto): Promise<any>{
        const findFollowUser = await this.userModel.findById(userId);
        if (!findFollowUser) throw new BadRequestException('User not found');

        return await this.followModel.find({
            user: userId
        }).populate('user')
            .populate('follow')
            .skip( Number( (query.page - 1)*query.limit ) )
            .limit( Number( query.limit ) )
            .exec()
    }

    async checkIsFollowing(userId, followId ): Promise<FollowEntityDocument>{
        return await this.followModel.findOne({
            user: userId,
            follow: followId
        }).exec()
    }

    async getProfile( id: string) : Promise<User[]>{

        return await this.userModel
            .aggregate([
                { 
                    $match: { _id: new mongoose.Types.ObjectId(id) }
                },
                {
                    $lookup: {
                        from: 'livestreams',
                        let: { user_id: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $and: [
                                        { 
                                            $expr: { $eq: ['$streamer', '$$user_id'] }
                                        },
                                        {
                                            "endLiveAt" : { $exists: false }
                                        }
                                    ]  
                                }
                                
                            },
                            // {
                            //     $project: {
                            //         _id: 1,
                            //         isLiveNow: { $cond: [{$not: ['$endLiveAt']}, true, false] },
                            //         categories: 1,
                            //         startLiveAt: 1,
                            //         viewCount: 1,
                            //         channelName: 1,
                            //         coverPicture: 1,
                            //         streamer: 1,
                            //         channelTitle: 1,
                            //         streamerUid: 1,
                            //         endLiveAt: 1,
                            //     }
                            // },
                            // { $group: { _id: '$isLiveNow' } },
                            
                            {
                                $lookup: {
                                    from: "users",
                                    localField: "streamer",
                                    foreignField: "_id",
                                    as: "streamer"
                                }
                            },
                            {
                                $lookup: {
                                    from: "categories",
                                    localField: "categories",
                                    foreignField: "_id",
                                    as: "categories"
                                }
                            },
                            {
                                $unwind: {  path: "$streamer" }
                            },
                            { $sort: { _id: -1 } },
                            { $limit: 1 }
                        ],
                        as: 'livestreams'
                    }
                },

                {
                    $unwind: {  path: "$livestreams", preserveNullAndEmptyArrays: true }
                },

                {
                    $lookup: {
                        from: "follows",
                        localField: "_id",
                        foreignField: "follow",
                        as: "follower"
                    }
                },
               
                {
                    $lookup: {
                        from: "follows",
                        localField: "_id",
                        foreignField: "user",
                        as: "following"
                    }
                },

                {
                    $lookup: {
                        from: "levels",
                        localField: "userLevel",
                        foreignField: "_id",
                        as: "userLevel"
                    }
                },

                {
                    $unwind: {  path: "$userLevel", preserveNullAndEmptyArrays: true }
                },

                {
                    $lookup: {
                        from: "shops",
                        let: { user_id: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$user', '$$user_id'] }
                                }
                            },
                            { $sort: { _id: -1 } },
                            { $limit: 1 }
                        ],
                        as: "shop"
                    }
                },

                {
                    $unwind: {  path: "$shop", preserveNullAndEmptyArrays: true }
                },                
               
                {
                   $addFields: {
                        isLiveStreamNow: {
                            // $cond: {
                            //     if: {$gt: [{$size: "$livestreams"}, 0 ]} , then: true, else: false 
                            // }
                            
                            $cond: {
                                if:  "$livestreams" , then: true, else: false 
                            }

                        },
                        livestream: { 
                            // $cond: { if: {$gt: [{$size: "$livestreams"}, 0 ]} , then: "$livestreams[0]" , else: null  } 
                            $cond: {
                                if:  "$livestreams" , then: "$livestreams"  , else: null 
                            }
                        },
                        follower: { $size: '$follower' },
                        following: { $size: '$following' }
                   }
                   
                },

                { $limit: 1 }

            ])
        
        .exec()
        // return await this.userModel.findById(id).exec()
    }

    async searchByName(query: SearchIdoDto ) : Promise<User[]>{
       
        return await this.userModel
        .aggregate([
            {
                $match: {
                    fullname: { $regex: new RegExp( query.keyword, 'i' ) }
                }
            }, 
            {
                $lookup: {
                    from: 'livestreams',
                    let: { user_id: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $and: [
                                    { 
                                        $expr: { $eq: ['$streamer', '$$user_id'] }
                                    },
                                    {
                                        "endLiveAt" : { $exists: false }
                                    }
                                ]  
                            },
                             
                        },
                        // {
                        //     $project: {
                        //         _id: 1,
                        //         isLiveNow: { $cond: [{$not: ['$endLiveAt']}, true, false] }
                        //     }
                        // },
                        // { $group: { _id: '$isLiveNow' } },
                        { $sort: { _id: -1 } },
                        { $limit: 1 }
                    ],
                    as: 'livestreams'
                }
            },

            {
                $lookup: {
                    from: "follows",
                    localField: "_id",
                    foreignField: "follow",
                    as: "follower"
                }
            },
           
            {
                $lookup: {
                    from: "follows",
                    localField: "_id",
                    foreignField: "user",
                    as: "following"
                }
            },
            {
               $addFields: {
                    isLiveStreamNow: { 
                        $cond: {
                            if: {$gt: [{$size: "$livestreams"}, 0 ]} , then: true, else: false 
                        }
                    },
                    follower: { $size: '$follower' },
                    following: { $size: '$following' }
               }
               
            },
            { $sort: { isLiveStreamNow: -1 } },

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


        ]).exec()
    }

    async getTopStreamers( query: QueryPaginateDto ){
        return await this.userModel
        .aggregate([
            {
                $lookup: {
                    from: 'livestreams',
                    let: { user_id: '$_id' },
                    pipeline: [
                        
                        {
                            $match: {
                                $and: [
                                    { 
                                        $expr: { $eq: ['$streamer', '$$user_id'] }
                                    },
                                    {
                                        "endLiveAt" : { $exists: false }
                                    }
                                ]  
                            }
                        },
                        // {
                        //     $project: {
                        //         _id: 1,
                        //         isLiveNow: { $cond: [{$not: ['$endLiveAt']}, true, false] },
                        //         categories: 1,
                        //         startLiveAt: 1,
                        //         viewCount: 1,
                        //         channelName: 1,
                        //         coverPicture: 1,
                        //         streamer: 1,
                        //         channelTitle: 1,
                        //         streamerUid: 1,
                        //         endLiveAt: 1,
                        //     }
                        // },
                        // { $group: { _id: '$isLiveNow' } },
                        // { $sort: { _id: -1 } },
                        {
                            $lookup: {
                                from: "users",
                                localField: "streamer",
                                foreignField: "_id",
                                as: "streamer"
                            }
                        },
                        {
                            $lookup: {
                                from: "categories",
                                localField: "categories",
                                foreignField: "_id",
                                as: "categories"
                            }
                        },
                        {
                            $unwind: {  path: "$streamer" }
                        },
                        { $sort: { _id: -1 } },
                        { $limit: 1 }
                    ],
                    as: 'livestreams'
                }
            },

            {
                $unwind: {  path: "$livestreams", preserveNullAndEmptyArrays: true }
            },

            {
                $lookup: {
                    from: "follows",
                    localField: "_id",
                    foreignField: "follow",
                    as: "follower"
                }
            },
           
            {
                $lookup: {
                    from: "follows",
                    localField: "_id",
                    foreignField: "user",
                    as: "following"
                }
            },

            {
               $addFields: {
                    isLiveStreamNow: {
                        // $cond: {
                        //     if: {$gt: [{$size: "$livestreams"}, 0 ]} , then: true, else: false 
                        // }
                        
                        $cond: {
                            if:  "$livestreams" , then: true, else: false 
                        }

                    },
                    livestream: { 
                        // $cond: { if: {$gt: [{$size: "$livestreams"}, 0 ]} , then: "$livestreams[0]" , else: null  } 
                        $cond: {
                            if:  "$livestreams" , then: "$livestreams"  , else: null 
                        }
                    },
                    follower: { $size: '$follower' },
                    following: { $size: '$following' }
               }
            },
            { $sort: { "follower": -1 } },

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

            // { $limit: Number(query.limit) },
            // { $skip:  Number(query.limit) * (Number(query.page) - 1) }

        ]).exec()
    }

    async getIsFollowing(  userId, query: QueryPaginateDto  ){
        const allUserIsFollowingIds = await this.getAllFollowingOfUser( userId );
       
        const arrIds = allUserIsFollowingIds.map( i => i.follow );

        return await this.userModel
        .aggregate([
            
            { "$match" : { "_id": { "$in": arrIds } } },
            {
                
                $lookup: {
                    from: 'livestreams',
                    let: { user_id: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $and: [
                                    { 
                                        $expr: { $eq: ['$streamer', '$$user_id'] }
                                    },
                                    {
                                        "endLiveAt" : { $exists: false }
                                    }
                                ]  
                            },
                        },
                        // {
                        //     $project: {
                        //         _id: 1,
                        //         isLiveNow: { $cond: [{$not: ['$endLiveAt']}, true, false] }
                        //     }
                        // },
                        // { $group: { _id: '$isLiveNow' } },
                        { $sort: { _id: -1 } },
                        { $limit: 1 }
                    ],
                    as: 'livestreams'
                }
            },

            {
                $lookup: {
                    from: "follows",
                    localField: "_id",
                    foreignField: "follow",
                    as: "follower"
                }
            },
           
            {
                $lookup: {
                    from: "follows",
                    localField: "_id",
                    foreignField: "user",
                    as: "following"
                }
            },

            {
               $addFields: {
                    isLiveStreamNow: { 
                        $cond: {
                            if: {$gt: [{$size: "$livestreams"}, 0 ]} , then: true, else: false 
                        }
                    },
                    follower: { $size: '$follower' },
                    following: { $size: '$following' }
               }
               
            },
            
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

            // { $limit: Number(query.limit) },
            // { $skip:  Number(query.limit) * (Number(query.page) - 1) }

        ]).exec()
    }

    async getAllFollowingOfUser(userId): Promise<any>{
        return await this.followModel.find({
            user: userId
        }).select({
            follow: 1, _id: 0
        })
        .exec()
    }

    async registerFcmToken( userId: string, body: RegisterFcmTokenDto ): Promise<UserFcmTokenEntityDocument>{
        const find = await this.fcmTokenModel.findOne({
            fcmToken: body.fcmToken
        }).exec();

        if( find ){

            if(find.user == userId){
                return find;
            }else{
                await this.fcmTokenModel.updateOne({
                    fcmToken: body.fcmToken
                },{
                    user: userId
                })
            }
            
        }else{
            const createNew = new this.fcmTokenModel({
                user: userId,
                fcmToken: body.fcmToken
            });
            return await createNew.save();
        }  
    }

    async getUserFollowerFcmToken( userId ): Promise<any>{
        // const users: string[] = await this.followModel.find({
        //     follow: userId
        // }).select('user').distinct('user').exec()

        // const fcms = await this.fcmTokenModel.find(
        //     { user : { $in : users } }
        // ).select('fcmToken').distinct('fcmToken').exec()

        const users = await this.followModel.find({
            follow: userId
        }).select('user').distinct('user').exec()

        const fcms = await this.fcmTokenModel.find(
            { user : { $in : users } }
        ).select('fcmToken').distinct('fcmToken').exec()

        return {
            users: users,
            fcms: fcms
        };
    }

    async getAllUserFcmtokens(): Promise<string[]>{
        const fcms = await this.fcmTokenModel.find().select('fcmToken').distinct('fcmToken').exec()
        return fcms;
    }

    async getAllUserActive(): Promise<string[]>{
        return await this.userModel.find({ isVerified: true }).select('_id').distinct('_id').exec()
    }

    async getUserFcmToken(userId: string): Promise<string[]>{
        const fcms = await this.fcmTokenModel.find({
            user: userId
        }).select('fcmToken').distinct('fcmToken').exec();
        return fcms;
    }

    /**
     * 
     * @param userId string[]
     * @returns string[]
     */
    async getManyUserFcmToken(userId: string[] ): Promise<string[]>{
        const fcms = await this.fcmTokenModel.find({
            user: { $in: userId }
        }).select('fcmToken').distinct('fcmToken').exec();
        return fcms;
    }

    async sendFcmCloudMessage( userId: string, messageData: INotifyMessageBody ): Promise<any>{
        const fcms = await this.getUserFcmToken(userId);
        if(fcms.length > 0)
            return await this.firebaseService.sendMessage( fcms, messageData );
        return false;
    }

    async createWithDraw( dto ): Promise<any>{
        const data = new this.withDrawModel(dto);
        await data.save();
        return await data.populate('user').execPopulate();
    }

    async getTotalWithDraw(userId: string): Promise<any>{
        return await this.withDrawModel.aggregate([
            { $match: { 
                    user: new mongoose.Types.ObjectId(userId),
                    status: 'completed'
                } 
            },
            { $group: { _id: "$user" , total: { $sum: "$total" }} },
            { $project: { _id: 0, total: 1, } }
        ]).exec()
    }

    async getTotalWithDrawOnRequest(userId: string): Promise<any>{
        return await this.withDrawModel.aggregate([
            { $match: { 
                    user: new mongoose.Types.ObjectId(userId),
                    status: { $in : [ WithDrawStatus.COMPLETED , WithDrawStatus.PROCESSING ]}
                } 
            },
            { $group: { _id: "$user" , total: { $sum: "$total" }} },
            { $project: { _id: 0, total: 1, } }
        ]).exec()
    }

    async getWithDrawHistory( userId: string, query: GetWithDrawDto ): Promise<any>{
        let queryDocs = {
            user: userId
        };
     
        if( query.status ){
            queryDocs['status'] = query.status;
        }
        
        const countPromise = this.withDrawModel.countDocuments(queryDocs);
        const docsPromise = this.withDrawModel.find(queryDocs)
            .populate('user')
            .sort({ createdAt: -1 })
            .skip( Number( (query.page - 1) * query.limit ) )
            .limit( Number( query.limit ) )
            .exec()
    
        const [total, items] = await Promise.all([countPromise, docsPromise]);

        return {
          total,
          items
        }
    }

    // admin
    async adminGetWithDrawHistory( query: AdminGetWithDrawDto ): Promise<any>{
        let queryDocs = {};
        if( query.user ){
            queryDocs['user'] = query.user;
        }
        
        if( query.status ){
            queryDocs['status'] = query.status;
        }
        
        const countPromise = this.withDrawModel.countDocuments(queryDocs);
        const docsPromise = this.withDrawModel.find(queryDocs)
            .populate('user')
            .sort({ createdAt: -1 })
            .skip( Number( (query.page - 1) * query.limit ) )
            .limit( Number( query.limit ) )
            .exec()
    
        const [total, items] = await Promise.all([countPromise, docsPromise]);

        return {
          total,
          items
        }
    }

    async adminUpdateWithDrawStatus(id: string, body: AdminUpdateWithDrawDto): Promise<any>{
        const data = await this.withDrawModel.findByIdAndUpdate(id, {
            status: body.status
        });
        return await data.populate('user').execPopulate();
    }
}
