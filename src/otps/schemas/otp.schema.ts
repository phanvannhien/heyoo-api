import * as mongoose from 'mongoose';

export const OtpSchema = new mongoose.Schema({
    phone: String,
    otpCode: Number,
    otpType: { type: String, default: 'register' },
    createdAt: { type: Date, default: Date.now() },
    expriredAt: { type: Date },
    nextRequestMinutes: { type: Number }
});