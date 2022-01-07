import { IsIn, IsMongoId, IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus } from "../schemas/payment.schema";

export class AdminUpdateStatusDto{
    @ApiProperty()
    @IsIn( Object.values( PaymentStatus ) )
    @IsOptional()
    status: string;
}