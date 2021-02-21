import { ApiProperty } from "@nestjs/swagger";

export class OtpResponse{
  
    constructor( object: any ){
        this.id = object.id;
        this.phone = object.phone;
        this.otpCode = object.otpCode;
        this.otpType = object.otpType;
        this.createdAt = object.createdAt;
        this.expriredAt = object.expriredAt;
        this.nextRequestMinutes = object.nextRequestMinutes;
    }
    @ApiProperty()
    id: String;

    @ApiProperty()
    phone: String;

    @ApiProperty()
    otpCode: Number;

    @ApiProperty()
    otpType: String;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    expriredAt: Date;

    @ApiProperty()
    nextRequestMinutes: Number

}