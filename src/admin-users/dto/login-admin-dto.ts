import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import { string } from "yargs";

export class LoginAdminDto{
    
    @ApiProperty({
        default: 'admin@admmin.com'
    })
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        type: string,
        default: '123456'
    })
    @IsNotEmpty()
    @IsString()
    password: string;
}