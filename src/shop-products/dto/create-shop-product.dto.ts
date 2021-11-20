import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsInt, IsMongoId, IsNotEmpty, Min } from "class-validator";

export class CreateShopProductDto {
    @ApiProperty()
    @IsNotEmpty()
    productName: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsInt()
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
    category: string;

    @ApiProperty()
    @IsNotEmpty()
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