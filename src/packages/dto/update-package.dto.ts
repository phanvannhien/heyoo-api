import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class UpdatePackageDto {
    @ApiProperty()
    @IsOptional()
    image?: string;

    @ApiProperty()
    @IsOptional()
    quantity?: number;

    @ApiProperty({
        required: false
    })
    @IsOptional()
    name?: string;

    @ApiProperty({
        required: false
    })
    @IsOptional()
    @IsNumber()
    price?: number;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    isBestSale?: boolean;
}