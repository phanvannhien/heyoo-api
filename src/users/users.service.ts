import { 
    Injectable, BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { FilesService } from 'src/files/files.service';
import { LivestreamsService } from 'src/livestreams/livestreams.service';
import { FindUserDto } from './dto/find-user.dto';
import { User } from './interfaces/user.interface';
import { GetUserDto } from './dto/get-users.dto';
import { FollowEntityDocument } from './interfaces/follow.entity';
import { GetFollowerDto } from './dto/getfollower.dto';
import { GetFollowingDto } from './dto/getfollowing.dto';
import * as mongoose from 'mongoose';

@Injectable()
export class UsersService {


    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        @InjectModel('Follow') private readonly followModel: Model<FollowEntityDocument>,
        private readonly filesService: FilesService,
        private readonly liveStreamService: LivestreamsService,
    ){

    }

    async find(): Promise<User[]>{
        return await this.userModel.find().exec();
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

    async findByPhone( phone: string) : Promise<User>{
        return await this.userModel.findOne({ phone: phone }).exec()
    }
 
    async findById( id: string) : Promise<User>{
        return await this.userModel.findById(id).exec()
    }

    async findOrCreateFacebookId( socialProfile: any ) : Promise<User>{

        const user = await this.userModel.findOne({ 'facebook.id': socialProfile.id }).exec();
        if( user ) return user;
        const createUser = new this.userModel({
            fullname: socialProfile.displayName,
            email: socialProfile.emails[0].value,
            avatar: socialProfile.photos[0].value,
            isVerified: true,
            facebook: {
                id: socialProfile.id,
            }
        });
    
        return await createUser.save();
        
    } 

    async findOrCreateGoogleId( socialProfile: any ) : Promise<User>{

        const user = await this.userModel.findOne({ 'google.id': socialProfile.sub }).exec();
        if( user ) return user;
        const createUser = new this.userModel({
            fullname: socialProfile.name || '',
            email: socialProfile.email,
            avatar: socialProfile.picture || '',
            isVerified: true,
            google: {
                id: socialProfile.sub,
            }
        });
    
        return await createUser.save();
    }
    
    async findOrCreateAppleId( socialProfile: any ) : Promise<User>{

        const user = await this.userModel.findOne({ 'apple.id': socialProfile.sub }).exec();
        if( user ) return user;
        const createUser = new this.userModel({
            fullname: 'No name',
            email: socialProfile.email,
            avatar: '',
            isVerified: true,
            apple: {
                id: socialProfile.sub,
            }
        });
    
        return await createUser.save();
        
    }
 
    async createUser( registerDto: RegisterDto ) : Promise<User>{
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
        const deleted = await this.userModel.findByIdAndRemove(id);
        // delete livestream by user
        await this.liveStreamService.removeLiveStreamByUser( id );
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
                    $project: {
                        _id: 1,
                        phone: 1,
                        dob: 1,
                        email: 1,
                        gender: 1,
                        isVerified: 1,
                        fullname: 1,
                        password: 1,
                        bio: 1,
                        address: 1,
                        country: 1,
                        avatar: 1,
                        facebook: 1,
                        google: 1,
                        apple: 1,
                        follower: { $size: '$follower' },
                        following: { $size: '$following' }
                    }
                },
               
                { $limit: 1 }

            ])
        
        .exec()



        // return await this.userModel.findById(id).exec()
    }

}
