export class UserDto{
  
    constructor( object: any ){
        this.fullname   = object.fullname;
        this.phone      = object.phone;
        this.email      = object.email;
        this.gender     = object.gender;
        this.avatar     = object.avatar;
        this.isVerified = object.isVerified;
        this.otp        = object.opt;
        this.otpCreatedAt = object.otpCreatedAt;
    }

    readonly fullname: string;
    readonly phone: string;
    readonly email: string;
    readonly gender: number;
    readonly avatar: string;
    readonly isVerified: boolean;
    readonly otp: string;
    readonly otpCreatedAt: Date;

}