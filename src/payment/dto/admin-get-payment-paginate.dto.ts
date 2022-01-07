import { IsIn, IsMongoId, IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus } from "../schemas/payment.schema";

export class AdminGetPaymentDto{
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
    @IsMongoId()
    @IsOptional()
    user?: string;

    @ApiProperty({
        type: String,
        required: false
    })
    @IsIn( Object.values( PaymentStatus ) )
    @IsOptional()
    status?: string;
}