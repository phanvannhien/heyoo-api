import { ApiProperty } from "@nestjs/swagger";

export class UserResponse{
  
    constructor( object: any ){
        this.id         = object.id;
        this.fullname   = object.fullname;
        this.phone      = object.phone;
        this.email      = object.email;
        this.gender     = object.gender;
        this.avatar     = object.avatar;
        this.isVerified = object.isVerified;
        this.otp        = object.opt;
        this.otpCreatedAt = object.otpCreatedAt;
    }
    @ApiProperty()
    readonly id: string;

    @ApiProperty()
    readonly fullname: string;
    @ApiProperty()
    readonly phone: string;
    @ApiProperty({
        required: false
    })
    readonly email: string;
    @ApiProperty({
        required: false
    })
    readonly gender: number;
    @ApiProperty({
        required: false
    })
    readonly avatar: string;
    @ApiProperty()
    readonly isVerified: boolean;
    
    readonly otp: string;
    @ApiProperty()
    readonly otpCreatedAt: Date;

}