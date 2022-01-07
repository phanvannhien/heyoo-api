import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsIn, IsMongoId } from "class-validator";

export class SendDiamondDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    quantity: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId()
    toUserId: string;
}