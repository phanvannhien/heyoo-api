import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class UpdateProductDto {
    @ApiProperty({ 
        type: 'string', 
        format: 'binary',
        required: false
    })
    @IsOptional()
    image?: string;

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