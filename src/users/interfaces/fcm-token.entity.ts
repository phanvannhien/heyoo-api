import { Document } from 'mongoose';
import { User } from './user.interface';

export interface UserFcmTokenEntityDocument extends Document {
    readonly user: string;
    readonly fcmToken: string;
}
