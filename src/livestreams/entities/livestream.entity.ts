import { Document } from 'mongoose';

export interface LiveStreamEntityDocument extends Document {
    readonly channelName: String;
    readonly coverPicture: String;
    readonly startLiveAt: Date;
    readonly endLiveAt: String;
    readonly streamer: String;
    readonly categories: Array<any>;
    readonly members: Array<any>;
}
