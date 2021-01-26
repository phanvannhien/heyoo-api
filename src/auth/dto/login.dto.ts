import { IsEmail, IsNotEmpty, IsPhoneNumber } from "class-validator";

export class LoginDto{
    @IsNotEmpty()
    phone: string;

    @IsNotEmpty()
    password: string;
}