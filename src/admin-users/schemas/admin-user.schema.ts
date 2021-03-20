import * as mongoose from 'mongoose';

export const AdminUserSchema = new mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    activated: { type: Boolean, default: 1 },
    language: { type: String, default: 'en' },
    createdAt: { type: Date, default: Date.now() }
});