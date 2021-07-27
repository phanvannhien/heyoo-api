import { Document } from 'mongoose';
import { ShopEntityDocument } from 'src/shop/entities/shop.entity';
import { UserEntity } from 'src/users/serializes/user.serialize';

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
    readonly streamer: UserEntity ;
    readonly categories: Array<any>;
    readonly viewCount: number;
    readonly shop: string;
    readonly videoUrl: string;
    readonly agoraToken: string;
    readonly agoraRtmToken: string;
    agoraRecordUid: number;
    readonly agoraResourceId: string;
    readonly agoraSid: string;
    readonly agoraFileList: string;
    readonly liveMode: string;
    readonly duetGuestId: string;
    readonly duetGuestUid: string;
    readonly donateUid: string;
}
