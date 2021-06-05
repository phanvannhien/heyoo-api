import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsPhoneNumber, MinLength } from "class-validator";

export class VerifyOtpDto {
    @ApiProperty({
        default: '+84902181852'
    })
    @IsNotEmpty()
    @IsPhoneNumber('ZZ')
    phone: string;
    
    @ApiProperty({
        type: String,
        default: "1234"
    })
    @IsNotEmpty()
    otpCode: String;
}
