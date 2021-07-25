import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class UpdateProductDto {
    @ApiProperty()
    @IsOptional()
    image?: string;

    @ApiProperty()
    @IsOptional()
    imageAnimation?: string;

    @ApiProperty({
        required: false
    })
    @IsOptional()
    productName?: string;

    @ApiProperty({
        required: false
    })
    @IsOptional()
    price?: number;


}