import { IsEmail, IsNotEmpty, IsPhoneNumber } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto{
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
    password: string;
}