import * as mongoose from 'mongoose';

export const ShopSchema = new mongoose.Schema({
    shopName: { type: String, require: true },
    phone:  { type: String, require: true },
    image:  { type: String, require: true },
    email:  { type: String, require: true },
    location: { type: String },
    description: { type: String },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
    status: { type: Number, default: 1 },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ShopCategories'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    viewCount: { type: Number, default: 0 },
}, {
    collection: 'shops'
});