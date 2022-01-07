import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsIn, IsMongoId } from "class-validator";

export class CreateCompletedTransactionDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId()
    orderId: string;
}