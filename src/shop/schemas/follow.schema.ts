import * as mongoose from 'mongoose';
import { SHOP_MODEL } from 'src/mongo-model.constance';

export const ShopFollowSchema = new mongoose.Schema({
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: SHOP_MODEL
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: { type: Date, default: Date.now() }
}, {
    collection: 'shop_follows'
});