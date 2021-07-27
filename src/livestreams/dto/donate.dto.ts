import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsMongoId, Min } from "class-validator";

export class DonateDto {

    @ApiProperty()
    @IsMongoId()
    @IsNotEmpty()
    toUser: string;

    @ApiProperty()
    @IsMongoId()
    @IsNotEmpty()
    product: string;

    @ApiProperty({
        type: Number,
        default: 1
    })
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    quantity: number;
}