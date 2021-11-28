import { IsMongoId, IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class AdminGetUserWallCommentDto{
    @ApiProperty({
        type: String,
        default: '',
        required: false
    })
    @IsOptional()
    comment: string;

    @ApiProperty({
        required: false
    })
    @IsOptional()
    createdAt: string;

    @ApiProperty({
        type: String,
        default: '',
        required: false
    })
    @IsOptional()
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