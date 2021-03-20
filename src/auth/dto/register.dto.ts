import { IsNotEmpty, IsNumber, IsEmail, IsPhoneNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto{

    @ApiProperty()
    @IsNotEmpty()
    fullname: string;

    @ApiProperty({
        default: '+84971181852'
    })
    @IsNotEmpty()
    @IsPhoneNumber('ZZ')
    phone: string;
    
    @ApiProperty({
        default: '123456'
    })
    @IsNotEmpty()
    @IsString()
    password: string;

    isVerified: boolean;

}