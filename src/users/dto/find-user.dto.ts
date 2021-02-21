import { IsNotEmpty, IsNumber, IsEmail, IsPhoneNumber, IsOptional, IsMongoId } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class FindUserDto{

    @ApiProperty({
        default: '60162923962c48134fc2efe2',
        required: false
    })
    @IsOptional()
    @IsMongoId()
    id: string;

    @ApiProperty({
        default: '+84971181852',
        required: false
    })
    @IsOptional()
    @IsPhoneNumber('ZZ')
    phone: string;
    
    @ApiProperty({ required: false })
    @IsOptional()
    @IsEmail()
    email: string;
}