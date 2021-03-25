import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsIn, IsMongoId, Min } from "class-validator";

export class CreateOrderDto {

    
    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId()
    product: string;

    @ApiProperty({
        type: Number,
        default: 1
    })
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    quantity: number;

    @ApiProperty({
        type: String,
        default: 'gateway'
    })
    @IsIn(['gateway','wallet'])
    @IsNotEmpty()
    paymentMethod: string;
}