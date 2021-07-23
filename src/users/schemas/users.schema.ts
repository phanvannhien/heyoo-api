import * as mongoose from 'mongoose';


export const UserSchema = new mongoose.Schema({
    fullname: String,
    phone: { type: String, index: true, default: '' },
    email: { type: String, index: true, default: '' },
    password: String,
    gender: { type: Number, default: 0 },
    avatar: String,
    isVerified: { type: Boolean, default: false },
    facebook: {
        id: { type: String }
    },
    google: {
        id: { type: String }
    },
    apple: {
        id: { type: String }
    },
    dob: String,
    country: String,
    address: String,
    bio: String,
    sendBirdToken: String

});