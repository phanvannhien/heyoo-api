import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsIn, IsMongoId } from "class-validator";

export class CreatePaymentUrlDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId()
    packageId: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsIn(['en','vi'])
    language: string;

    
}