import { IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class SearchIdoDto{

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

    @ApiProperty({ type: String, required: true })
    @IsNotEmpty()
    keyword: string;
}