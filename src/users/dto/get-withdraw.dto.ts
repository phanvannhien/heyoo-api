import { IsIn, IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import { WithDrawStatus } from "../schemas/withdraw.schema";

export class GetWithDrawDto{
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

    @ApiProperty({
        type: String,
        required: false
    })
    @IsIn( Object.values( WithDrawStatus ) )
    @IsOptional()
    status?: string;
}