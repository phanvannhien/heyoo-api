import * as mongoose from 'mongoose';

export const TransactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    transactionId: { type: String, default: '' },
    quantity: Number,
    rate: { type: Number, default: 1 },
    total: Number,
    status: { type: String, default: 'atm' }, // success | cancel
    paymentMethod: { type: String, default: 'gateway' }, // gateway | wallet
    resource: { type: String, default: 'user' }, // user | system
    createdAt: { type: Date, default: Date.now() }
});