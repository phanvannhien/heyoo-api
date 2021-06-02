import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, Min, MinLength } from "class-validator";

// export class UpdateVideosDto extends PartialType(CreateVideosDto) {}

export class UpdateShopDto {
    @ApiProperty()
    @IsNotEmpty()
    shopName: string;

    @ApiProperty({ type: String })
    @IsNotEmpty()
    image: string;
    
    @ApiProperty({ type: String })
    @IsNotEmpty()
    phone: string;

    @ApiProperty({ type: String })
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