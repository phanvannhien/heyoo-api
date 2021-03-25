import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateManyTransactionDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    quantity: number;

}