import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsPhoneNumber } from "class-validator";

export class CreateOtpDto {
    @ApiProperty({
        default: '+84971181852'
    })
    @IsNotEmpty()
    @IsPhoneNumber('ZZ')
    phone: string;

    otpCode: Number;
    otpType: String;
    createdAt: Date;
    expriredAt: Date;
    nextRequestMinutes: Number;
}
