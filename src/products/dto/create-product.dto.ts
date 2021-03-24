import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateProductDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    image: string;

    @ApiProperty()
    @IsNotEmpty()
    productName: string;

    @ApiProperty()
    @IsNotEmpty()
    price: number;
}