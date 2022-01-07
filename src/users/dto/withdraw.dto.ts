import { IsNotEmpty, IsNumber, IsEmail, IsPhoneNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateWithDrawDto{
    @ApiProperty()
    @IsNumber()
    quantity: string;
}