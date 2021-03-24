import { IsNotEmpty } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class GetProductDto{

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