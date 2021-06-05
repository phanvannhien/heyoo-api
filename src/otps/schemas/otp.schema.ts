import * as mongoose from 'mongoose';

export const OtpSchema = new mongoose.Schema({
    phone: String,
    otpCode: String,
    otpType: { type: String, default: 'register' },
    createdAt: { type: Date, default: Date.now() },
    expriredAt: { type: Date },
    nextRequestMinutes: { type: Number }
});