import { Document } from 'mongoose';
import { UserWallEntityDocument } from 'src/user-walls/entities/user-wall.entity';
import { User } from '../../users/interfaces/user.interface'

export interface UserWallCommentEntityDocument extends Document {
    readonly comment: string;
    readonly createdAt: string;
    readonly user: string;
    readonly wall: string;
}