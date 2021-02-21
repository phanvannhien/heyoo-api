import { IsNotEmpty, IsNumber, IsEmail, IsPhoneNumber, IsOptional, IsDateString, IsString, IsEnum, IsISO31661Alpha2 } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto{

    @ApiProperty()
    @IsNotEmpty()
    fullname: string;

    @ApiProperty({
        enum: ['Male','Female']
    })
    @IsNotEmpty()
    @IsEnum({
        Male: 'Male',
        Female: 'Female'
    })
    gender: string;

    @ApiProperty({
        type: Date()
    })
    @IsDateString()
    dob: string;

    @ApiProperty({
        default: 'abc@gmail.com'
    })
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    @IsISO31661Alpha2()
    country: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    address: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    bio: string;
}