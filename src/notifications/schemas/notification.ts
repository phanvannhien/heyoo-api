import * as mongoose from 'mongoose';

export const NotificationSchema = new mongoose.Schema({
    title: { type: String, require: true },
    image: String,
    viewCount: { type: Number, default: 0 },
    shareCount: { type: Number, default: 0 },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NewsCategories'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdminUser'
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdminUser'
    },
    excerpt: String,
    description: String,
    status: { type: Number, default: 0 }
}, {
    timestamps: true,
    collection: 'news'
});