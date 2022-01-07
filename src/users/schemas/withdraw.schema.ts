import * as mongoose from 'mongoose';

export enum WithDrawStatus {
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    CANCEL = 'cancel'
}

export const WithDrawSchema = new mongoose.Schema({
    total: Number,
    quantity: Number,
    info: String,
    status: {
        type: String,
        enum: WithDrawStatus,
        default: WithDrawStatus.PROCESSING
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
},{
    collection: 'withdraws',
    timestamps: true
})