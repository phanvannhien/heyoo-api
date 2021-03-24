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
    payment_method: String,
    status: String,
    created_at: { type: Date, default: Date.now() }
});