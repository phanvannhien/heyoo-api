import { Document } from 'mongoose';

export interface LiveStreamMemberEntityDocument extends Document{
    readonly liveStream: LiveStreamEntityDocument;
    readonly member: string;
    readonly joinAt?: Date;
    leaveAt?: Date;
    uid: number;
}

export interface LiveStreamEntityDocument extends Document {
    readonly channelTitle: string;
    readonly channelName: string;
    readonly coverPicture: string;
    readonly startLiveAt: Date;
    endLiveAt: Date;
    streamerUid: number;
    readonly streamer: string;
    readonly categories: Array<any>;
}
