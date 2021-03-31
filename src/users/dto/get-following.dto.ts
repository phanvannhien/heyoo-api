import { IsNotEmpty } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class GetFollowingDto{

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