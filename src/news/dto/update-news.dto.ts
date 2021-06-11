import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, Min, MinLength } from "class-validator";
import { CreateNewsDto } from "./create-news.dto";

// export class UpdateNewsDto extends PartialType(CreateNewsDto) {}

export class UpdateNewsDto {
    @ApiProperty({
        type: String
    })
    @IsNotEmpty()
    @MinLength(5)
    title: string;

    @ApiProperty({ type: String, required: false })
    @IsOptional()
    image?: string;

    @ApiProperty({
        type: String,
        default: '60a4cb1bb76a9f089c8d281d'
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
        type: String
    })
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        type: Number, 
    })
    @IsNotEmpty()
    status: Number;
}