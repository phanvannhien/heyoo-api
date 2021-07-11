import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, Validate } from "class-validator";

export class CreateNewsDto {
    
    @ApiProperty()
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    @ApiProperty({ type: String, default: 'https://picsum.photos/400/300' })
    image: string;

    @ApiProperty({
        type: String,
        default: '60acc36d3ac8061f2bf6d302'
    })
    @IsNotEmpty()
    @IsMongoId()
    category: string;

    @ApiProperty({
        type: String, 
    })
    @IsNotEmpty()
    excerpt: string;
    
    @ApiProperty({
        type: String, 
    })
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        type: Number, 
    })
    @IsNotEmpty()
    status: Number;

    @ApiProperty({
        type: Boolean, default: false 
    })
    @IsNotEmpty()
    isHot: boolean;
}