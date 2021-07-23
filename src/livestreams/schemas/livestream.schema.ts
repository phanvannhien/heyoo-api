import * as mongoose from 'mongoose';
import { SHOP_MODEL } from 'src/mongo-model.constance';


export const LiveStreamMemberSchema = new mongoose.Schema({
    liveStream: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LiveStreams'
    },
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    joinAt: { type: Date, default: Date.now },
    leaveAt: Date,
    uid: Number
})

// const StreamMembers = mongoose.model('StreamMembers', MemberSchema)

export const LiveStreamSchema = new mongoose.Schema({
    channelName: String,
    channelTitle: String,
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categories'
    }],
    coverPicture: String,
    startLiveAt: { type: Date, default: Date.now },
    endLiveAt: Date,
    streamer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    viewCount: { type: Number, default: 0 },
    streamerUid: Number,
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: SHOP_MODEL,
        default: null
    },
    videoUrl: String,
    agoraToken: String,
    agoraRtmToken: String,
    agoraRecordUid: Number,
    agoraResourceId: String,
    agoraSid: String,
    agoraFileList: String,
    liveMode: { type: String, default: 'single' }, // single / shop / duet

}, {
    timestamps: true
});

