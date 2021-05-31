import { IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class GetVideosDto{

    @ApiProperty({
        type: Number,
        default: 1
    })
    @IsNotEmpty()
    page: Number;

    @ApiProperty({
        type: Number,
        default: 20
    })
    @IsNotEmpty()
    limit: Number;

    @ApiProperty({ enum: [0,1], default: 1, required: false })
    @IsOptional()
    status?: Number;

    @ApiProperty({ type: String, required: false })
    @IsOptional()
    title?: String;
}