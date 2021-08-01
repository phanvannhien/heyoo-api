import { Document } from 'mongoose';
import { User } from 'src/users/interfaces/user.interface';


export interface NotificationEntityDocument extends Document {
    readonly title: string;
    readonly body: string;
    readonly imageUrl: string;
    readonly metaData: object;
    readonly clickAction: string;
    readonly isRead: boolean; 
    readonly user: string;
    readonly notifyId: string;
}
