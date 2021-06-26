import * as mongoose from 'mongoose';


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
    startLiveAt: { type: Date, default: Date.now() },
    endLiveAt: Date,
    streamer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    viewCount: { type: Number, default: 0 },
    streamerUid: Number
});

