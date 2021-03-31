import { Document } from 'mongoose';
import { User } from './user.interface';

export interface FollowEntityDocument extends Document {
    readonly user: User;
    readonly follow: User;
}
