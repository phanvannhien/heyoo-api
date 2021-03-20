import { IsNotEmpty, IsNumber, IsEmail, IsPhoneNumber, IsOptional, IsMongoId } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class GetLiveStreamDto{

    @ApiProperty()
    @IsNotEmpty()
    page: number;

    @ApiProperty()
    @IsNotEmpty()
    limit: number;

    @ApiProperty()
    @IsOptional()
    title?: string;
}