import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, Validate } from "class-validator";

export class CreateNewsDto {
    
    @ApiProperty()
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    @ApiProperty({ type: String })
    image: string;

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
        type: String, 
    })
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        type: Number, 
    })
    @IsNotEmpty()
    status: Number;
}