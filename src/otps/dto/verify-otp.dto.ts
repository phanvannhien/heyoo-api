import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsPhoneNumber, MinLength } from "class-validator";

export class VerifyOtpDto {
    @ApiProperty({
        default: '+84971181852'
    })
    @IsNotEmpty()
    @IsPhoneNumber('ZZ')
    phone: string;
    
    @ApiProperty()
    @IsNotEmpty()
    otpCode: Number;
}
