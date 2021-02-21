import { Document } from 'mongoose';

export interface OtpEntityDocument extends Document {
    phone: String,
    otpCode: Number,
    otpType: String,
    createdAt: Date,
    expriredAt: Date,
    nextRequestMinutes: Number
}
