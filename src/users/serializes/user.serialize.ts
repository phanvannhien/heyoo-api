import { Exclude } from "class-transformer";
export class UserEntity{


    id: number;
    fullname: string;
    phone: string;
    email: string;
    @Exclude()
    password: string;
    gender: number;
    avatar: string;
    isVerified: boolean;
    @Exclude()
    otp: string;
    @Exclude()
    otpCreatedAt: Date;
    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial);
    }


}