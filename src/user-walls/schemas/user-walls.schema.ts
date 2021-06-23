import * as mongoose from 'mongoose';


export const UserWallsSchema = new mongoose.Schema({
    caption: { type: String, require: true },
    images: [String],
    viewCount: { type: Number, default: 0 },
    shareCount: { type: Number, default: 0 },
    likeCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date },
    status: { type: Number, default: 1 },
    postType: { type: String, default: 'post' },
    liveStreamId: { type: String, default: null },
    liveStreamStatus: { type: Boolean, default: false },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
}, {
    collection: 'user_walls'
});