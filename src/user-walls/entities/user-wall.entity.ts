import { Document } from 'mongoose';
import { User } from '../../users/interfaces/user.interface'

export interface UserWallEntityDocument extends Document {
    readonly caption: string;
    readonly images: string[];
    readonly likeCount: number;
    readonly viewCount: number;
    readonly shareCount: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly status: number;
    readonly postType: string;
    readonly liveStreamId: string;
    readonly user: User;
    isLiked: boolean;
}