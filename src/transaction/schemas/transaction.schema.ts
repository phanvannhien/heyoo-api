import * as mongoose from 'mongoose';

export enum TransactionMethod {
    TOPUP = 'topup',
    SEND = 'send',
    RECEIVED = 'received'
}

export const TransactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    referenceId: { type: mongoose.Schema.Types.ObjectId, default: '' },
    transactionId: { type: String, default: '' },
    quantity: Number, // number of diamond
    rate: { type: Number, default: 1 }, // rate 1 diamond / 1000 VND
    total: Number, // total = quantity * rate
    status: { type: String, default: 'processing' }, // success
    paymentMethod: { type: String, default: 'topup' }, // topup, send, received
    resource: { type: String, default: 'user' }, // user | system
    info: String,
    createdAt: { type: Date, default: Date.now() }
});