import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, Validate } from "class-validator";

export class CreateVideosDto {
    
    @ApiProperty()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ type: String, default: 'https://picsum.photos/400/300' })
    @IsNotEmpty()
    image: string;
    
    @ApiProperty({ type: String, default: 'https://heyoo-public.s3.ap-southeast-1.amazonaws.com/file_example_MP4_1280_10MG.mp4' })
    @IsNotEmpty()
    videoUrl: string;

    @ApiProperty({
        type: String,
        default: '60a4cb1bb76a9f089c8d281d'
    })
    @IsNotEmpty()
    @IsMongoId()
    category: string;
    
    @ApiProperty({
        type: String
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
    status: number;

    @ApiProperty({
        type: Boolean, default: false 
    })
    @IsNotEmpty()
    isHot: boolean;
}