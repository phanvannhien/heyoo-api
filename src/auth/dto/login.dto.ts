import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import { string } from "yargs";

export class LoginDto{
    
    @ApiProperty({
        default: '+84971181852'
    })
    @IsNotEmpty()
    @IsPhoneNumber('ZZ')
    phone: string;

    @ApiProperty({
        default: 'a123456'
    })
    @IsNotEmpty()
    @IsString()
    password: string;
}