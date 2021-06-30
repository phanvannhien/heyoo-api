import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsUrl, Validate } from "class-validator";

export class CreateShopDto { 
    @ApiProperty()
    @IsNotEmpty()
    shopName: string;

    @ApiProperty({ 
        type: String,
        default: 'https://picsum.photos/800/600'
    })
    @IsNotEmpty()
    @IsUrl()
    image: string;

    // @ApiProperty({ 
    //     type: String,
    //     default: 'https://picsum.photos/800/400'
    // })
    // @IsOptional()
    // @IsUrl()
    // banner: string;
    
    @ApiProperty({ type: String, default: "+84902181852" })
    @IsNotEmpty()
    phone: string;

    @ApiProperty({ type: String, default: "phanvannhien@gmail.com" })
    @IsNotEmpty()
    email: string;

    @ApiProperty({ type: String })
    @IsOptional()
    location: string;

    @ApiProperty({
        type: String,
    })
    description: string;

    @ApiProperty({
        type: Number,
        default: 1
    })
    @IsNotEmpty()
    status: Number;

    @ApiProperty({
        type: String,
        default: '60a4cb1bb76a9f089c8d281d'
    })
    @IsNotEmpty()
    @IsMongoId()
    category: string;
}