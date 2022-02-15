import * as mongoose from 'mongoose';

export const OtpSchema = new mongoose.Schema({
    phone: String,
    otpCode: String,
    otpType: { type: String, default: 'register' },
    expriredAt: { type: Date },
    nextRequestMinutes: { type: Number }
},{
    timestamps: true
});