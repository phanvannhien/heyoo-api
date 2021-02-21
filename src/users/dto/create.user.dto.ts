import { IsNotEmpty, IsNumber, IsEmail, IsPhoneNumber, IsOptional } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto{

    @ApiProperty()
    @IsNotEmpty()
    fullname: string;

    @ApiProperty({
        default: '+84971181852'
    })
    @IsNotEmpty()
    @IsPhoneNumber('ZZ')
    phone: string;
    
    @ApiProperty({ required: false })
    @IsOptional()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    password: string;

    avatar: string;

    otp: number;

    otpCreatedAt: Date;

}