import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsIn, IsInt, IsMongoId, IsNotEmpty, IsNumber, IsOptional, Min } from "class-validator";
import { PaymentStatus } from "../schemas/payment.schema";

export class CreatePaymentDto {
    @ApiProperty()
    @IsNotEmpty()
    orderInfo: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId()
    user: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    price: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    diamondQty: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsIn( Object.values(PaymentStatus) )
    status: string;
}