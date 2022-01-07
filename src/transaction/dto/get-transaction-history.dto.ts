import { IsIn, IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import { TransactionMethod } from "../schemas/transaction.schema";


export class GetTransactionHistoryDto{
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

    @ApiProperty()
    @IsIn( Object.values(TransactionMethod) )
    @IsOptional()
    method?: string;
}