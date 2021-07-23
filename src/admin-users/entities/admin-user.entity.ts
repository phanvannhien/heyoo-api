import { Document } from 'mongoose';
export interface AdminUser extends Document {
    fullname: string;
    email: string;
    password: string;
    avatar: string;
    activated: boolean;
    language: string;
    role: string;
    createdAt: Date
}
