import { IsMongoId, IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class GetUserWallCommentDto{
    @ApiProperty({
        type: String,
        default: ''
    })
    @IsNotEmpty()
    @IsMongoId()
    wallId: string;
    
    @ApiProperty({
        type: Number,
        default: 1
    })
    @IsNotEmpty()
    page: number;

    @ApiProperty({
        type: Number,
        default: 20
    })
    @IsNotEmpty()
    limit: number;
}