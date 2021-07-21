import { IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class GetNewsDto{

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

    @ApiProperty({ enum: [0,1], default: 1, required: false })
    @IsOptional()
    status?: number;

    @ApiProperty({ type: String, required: false })
    @IsOptional()
    category?: string;

    @ApiProperty({ type: Boolean, required: false })
    @IsOptional()
    isHot?: boolean;

}