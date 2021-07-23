import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';


export class CreateAdminUserDto {
    @ApiProperty({
        default: 'admin@admmin.com'
    })
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        default: '123456'
    })
    @IsNotEmpty()
    password: string;

    @ApiProperty()
    @IsNotEmpty()
    fullname: string;
    

    @ApiProperty()
    @IsNotEmpty()
    activated: boolean;

    @ApiProperty()
    @IsOptional()
    language?: string;

    @ApiProperty()
    @IsNotEmpty()
    role: string;
    
}
