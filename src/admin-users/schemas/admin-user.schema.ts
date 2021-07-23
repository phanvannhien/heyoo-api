import * as mongoose from 'mongoose';

export const AdminUserSchema = new mongoose.Schema({
    fullname: String,
    email: { type: String, require: true },
    password: { type: String, require: true },
    role: { type: String, require: true },
    activated: { type: Boolean, default: 1 },
    language: { type: String, default: 'en' },
    createdAt: { type: Date, default: Date.now() }
});