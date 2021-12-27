import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, Min } from "class-validator";

export class CreatePackageDto {
    @ApiProperty({ 
        type: String,
        default: 'https://picsum.photos/800/800'
    })
    @IsNotEmpty()
    image: string;

    @ApiProperty()
    @IsNotEmpty()
    quantity: number;

    @ApiProperty()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    price: number;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    isBestSale?: boolean;
}