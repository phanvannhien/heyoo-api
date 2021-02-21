import { BadRequestException, Injectable
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { FilesService } from 'src/files/files.service';
import { CreateUserDto } from './dto/create.user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { User } from './interfaces/user.interface';
import { UserSchema } from './schemas/users.schema';



@Injectable()
export class UsersService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        private readonly filesService: FilesService
    ){

    }

    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
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
        const deleted = await this.userModel.findByIdAndRemove(id);
        return deleted;
    }
}
