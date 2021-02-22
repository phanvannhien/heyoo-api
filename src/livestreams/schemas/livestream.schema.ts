import * as mongoose from 'mongoose';

export const LiveStreamSchema = new mongoose.Schema({
    channelName: String,
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categories'
    }],
    coverPicture: String,
    startLiveAt: { type: Date, default: Date.now() },
    endLiveAt: Date,
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    streamer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});