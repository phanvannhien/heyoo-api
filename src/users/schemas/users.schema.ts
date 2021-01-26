import * as mongoose from 'mongoose';


export const UserSchema = new mongoose.Schema({
    fullname: String,
    phone: { type: String, index: true },
    email: String,
    password: String,
    gender: { type: Number, default: 0 },
    avatar: String,
    isVerified: { type: Boolean, default: false },
    otp: { type: String, default: '' },
    otpCreatedAt: { type: Date }
});