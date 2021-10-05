import { Document } from 'mongoose';

export interface User extends Document {
    readonly fullname: string;
    readonly phone: string;
    readonly email: string;
    readonly password: string;
    readonly gender: number;
    readonly avatar: string;
    readonly isVerified: boolean;
    readonly dob: string;
    readonly country: string;
    readonly address: string;
    readonly bio: string;
    readonly sendBirdToken: string;
    readonly userLevel: string;
}