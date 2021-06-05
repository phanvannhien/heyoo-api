import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsPhoneNumber } from "class-validator";

export class CreateOtpDto {
    @ApiProperty({
        default: '+84902181852'
    })
    @IsNotEmpty()
    @IsPhoneNumber('ZZ')
    phone: string;

    otpCode: String;
    otpType: String;
    createdAt: Date;
    expriredAt: Date;
    nextRequestMinutes: Number;
}
