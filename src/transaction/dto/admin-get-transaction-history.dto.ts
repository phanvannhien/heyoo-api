import { IsIn, IsMongoId, IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import { TransactionMethod } from "../schemas/transaction.schema";


export class AdminGetTransactionHistoryDto{
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
    @IsIn( Object.values(TransactionMethod) )
    @IsOptional()
    method?: string;

    @ApiProperty({
        type: String,
        required: false
    })
    @IsMongoId()
    @IsOptional()
    user?: string;
}