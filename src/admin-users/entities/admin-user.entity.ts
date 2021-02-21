import { Document } from 'mongoose';
export interface AdminUser extends Document {
    fullname: String;
    email: String;
    password: String;
    avatar: String;
    activated: Boolean;
    language: String;
    createdAt: Date
}
