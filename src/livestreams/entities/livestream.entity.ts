import { Document } from 'mongoose';

export interface LiveStreamMemberEntityDocument extends Document{
    readonly liveStream: LiveStreamEntityDocument;
    readonly member: string;
    readonly joinAt?: Date;
    leaveAt?: Date;
}

export interface LiveStreamEntityDocument extends Document {
 
    readonly channelTitle: string;
    readonly channelName: string;
    readonly coverPicture: string;
    readonly startLiveAt: Date;
    readonly endLiveAt: string;
    readonly streamer: string;
    readonly categories: Array<any>;
}
