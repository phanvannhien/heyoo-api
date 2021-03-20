import { IsNotEmpty, IsNumber, IsEmail, IsPhoneNumber, IsOptional, IsMongoId } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class GetCategoryDto{

    @ApiProperty()
    @IsNotEmpty()
    page: number;

    @ApiProperty()
    @IsNotEmpty()
    limit: number;
}