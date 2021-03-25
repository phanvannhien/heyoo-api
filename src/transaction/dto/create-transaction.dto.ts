import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsIn, IsMongoId } from "class-validator";

export class CreateTransactionDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    quantity: number;

    // @ApiProperty()
    // @IsNotEmpty()
    // @IsNumber()
    // rate: number;

    // @ApiProperty()
    // @IsNotEmpty()
    // @IsNumber()
    // total: number;

    // @ApiProperty()
    // @IsNotEmpty()
    // @IsIn(['user','system'])
    // resource: string;

    @ApiProperty({
        type: String,
        default: 'gateway',
        examples: ['gateway,wallet,sytem']
    })
    @IsNotEmpty()
    @IsIn(['gateway','wallet'])
    paymentMethod: string;

}