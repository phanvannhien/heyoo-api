import * as mongoose from 'mongoose';

export enum PaymentStatus {
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    CANCEL = 'cancel',
    FAIL = 'fail'
}

export const PaymentSchema = new mongoose.Schema({
    price: Number,
    diamondQty: Number,
    orderInfo: String,
    status: {
        type: String,
        enum: PaymentStatus,
        default: PaymentStatus.PROCESSING
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
},{
    collection: 'payments',
    timestamps: true
})