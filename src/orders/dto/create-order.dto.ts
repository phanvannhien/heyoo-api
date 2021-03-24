import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsIn } from "class-validator";

export class CreateOrderDto {
    
    @ApiProperty()
    product: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    quantity: number;

    @ApiProperty({
        type: String,
        default: 'gateway'
    })
    @IsIn(['gateway','wallet'])
    @IsNotEmpty()
    payment_method: number;
}