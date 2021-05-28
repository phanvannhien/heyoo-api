import * as mongoose from 'mongoose';

export const NewsSchema = new mongoose.Schema({
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
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
    description: String,
    status: { type: Number, default: 0 }
}, {
    collection: 'news'
});