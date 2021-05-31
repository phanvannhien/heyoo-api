import { IsNotEmpty, IsNumber, IsEmail, IsPhoneNumber, IsOptional, IsDateString, IsString, IsEnum, IsISO31661Alpha2, IsBoolean } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import { boolean } from "yargs";

export class UpdateProfileDto{

    @ApiProperty()
    @IsNotEmpty()
    fullname: string;

    @ApiProperty({
       type: Number,
       default: 0
    })
    @IsNotEmpty()
    @IsNumber()
    gender: number;

    @ApiProperty({
        type: Date
    })
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