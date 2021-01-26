import { Injectable
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create.user.dto';
import { User } from './interfaces/user.interface';
import { UserSchema } from './schemas/users.schema';



@Injectable()
export class UsersService {
    constructor(@InjectModel('User') private readonly userModel: Model<User>){

    }

    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async findByPhone( phone: string) : Promise<User>{
        return await this.userModel.findOne({ phone: phone }).exec()
    }
 
    async findById( id: string) : Promise<User>{
        return await this.userModel.findById(id).exec()
    }

    
    async createUser( createUserDto: CreateUserDto ) : Promise<User>{
        const createdUser = new this.userModel(createUserDto);
        return await createdUser.save();
    }
    
    async updateUser( id , data ): Promise<User> {
        const updated = await this.userModel
            .findByIdAndUpdate(id, data, { new: true });
        return updated;
    }

    async deleteUser( id ): Promise<any> {
        const deleted = await this.userModel.findByIdAndRemove(id);
        return deleted;
    }
}
