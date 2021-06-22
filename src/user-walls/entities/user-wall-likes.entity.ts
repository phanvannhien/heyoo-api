import { Document } from 'mongoose';
import { User } from '../../users/interfaces/user.interface'
import { UserWallEntityDocument } from './user-wall.entity';

export interface UserWallEntityLikeDocument extends Document {
    readonly userWall: string;
    readonly userLike: string;
}