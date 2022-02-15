import * as mongoose from 'mongoose';

export const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    quantity: Number,
    price: Number,
    total: Number,
    paymentMethod: String,
    status: String
},{
    collection: 'orders',
    timestamps: true
});