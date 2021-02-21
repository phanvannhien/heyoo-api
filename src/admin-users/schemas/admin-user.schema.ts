import * as mongoose from 'mongoose';

export const AdminUserSchema = new mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    avatar: String,
    activated: Boolean,
    language: { type: String, default: 'en' },
    createdAt: { type: Date, default: Date.now() }
});