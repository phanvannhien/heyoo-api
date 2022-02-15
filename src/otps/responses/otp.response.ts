import { ApiProperty } from "@nestjs/swagger";

export class OtpResponse{
  
    constructor( object: any ){
        this.id = object.id;
        this.phone = object.phone;
        this.otpCode = object.otpCode;
        this.otpType = object.otpType;
        this.createdAt =  new Date(object.createdAt).getTime().toString();
        this.expriredAt =  new Date(object.expriredAt).getTime().toString();
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
    createdAt: string;

    @ApiProperty()
    expriredAt: string;

    @ApiProperty()
    nextRequestMinutes: Number

}