import * as mongoose from 'mongoose';

export const NotificationSchema = new mongoose.Schema({
    title: { type: String, require: true },
    body: String,
    imageUrl: String,
    metaData: Object,
    clickAction: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isRead: { type: Boolean, default: 0 },
    notifyId: String
}, {
    timestamps: true,
    collection: 'notifications'
});