import { IsNotEmpty, IsNumber, IsEmail, IsPhoneNumber, IsOptional } from "class-validator";

export class CreateUserDto{
    @IsNotEmpty()
    fullname: string;

    @IsNotEmpty()
    @IsPhoneNumber('ZZ')
    phone: string;
    
    @IsOptional()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

    gender: number;

    avatar: string;

    isVerified: boolean;

    otp: number;

    otpCreatedAt: Date;

}