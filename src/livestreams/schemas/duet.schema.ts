import * as mongoose from 'mongoose';

export const DuetLivestreamSchema = new mongoose.Schema({
    liveStream: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LiveStreams'
    },
    hostUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    guestUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: String,
    inviteAt: Date,
    fcmTokens: [String]
},{
    collection: 'duets',
    timestamps: true
})