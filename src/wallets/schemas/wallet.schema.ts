import * as mongoose from 'mongoose';

export const WalletSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    toUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    liveStream: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LiveStreams'
    },
    donateUid: String,
    quantity: Number,
    price: Number,
    total: Number,
    resource: { type: String, default: 'user' }, // user | system
},{
    timestamps: true
});