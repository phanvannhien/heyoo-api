import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsInt, IsMongoId, IsNotEmpty, IsNumber, IsOptional, Min } from "class-validator";

export class CreateShopProductDto {
    @ApiProperty()
    @IsNotEmpty()
    productName: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    price: number;

    @ApiProperty({ 
        type: String,
        default: 'https://picsum.photos/800/800'
    })
    @IsNotEmpty()
    thumbnail: string;

    @ApiProperty({ 
        type: String,
        default: ['https://picsum.photos/800/800', 'https://picsum.photos/800/800']
    })
    @IsNotEmpty()
    @IsArray()
    images: string[];

    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId()
    category: string;

    @ApiProperty()
    @IsOptional()
    description: string;

    @ApiProperty()
    @IsMongoId()
    @IsNotEmpty()
    shop: string;

    @ApiProperty({
        type: Boolean,
        default: false
    })
    @IsNotEmpty()
    @IsBoolean()
    isPublished: boolean;
}