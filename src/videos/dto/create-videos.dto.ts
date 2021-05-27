import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, Validate } from "class-validator";

export class CreateVideosDto {
    
    @ApiProperty()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ type: 'string', format: 'binary' })
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
    description: string;


}