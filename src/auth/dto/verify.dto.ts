import { IsEmail, IsNotEmpty, IsPhoneNumber } from "class-validator";

export class VerifyDto{
    @IsNotEmpty()
    otp: string;
}