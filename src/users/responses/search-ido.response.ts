import { ApiProperty } from "@nestjs/swagger";

export class SearchIdoResponse{
  
    constructor( object: any ){
        this.id         = object._id;
        this.fullname   = object.fullname;
        this.phone      = object.phone;
        this.email      = object.email;
        this.gender     = object.gender;
        this.avatar     = object.avatar;
        this.isVerified = object.isVerified;
        this.isLiveStreamNow = object.isLiveStreamNow;
    }
    @ApiProperty()
    readonly id: string;

    @ApiProperty()
    readonly fullname: string;

    @ApiProperty()
    readonly phone: string;

    @ApiProperty()
    readonly email: string;

    @ApiProperty()
    readonly gender: number;

    @ApiProperty()
    readonly avatar: string;

    @ApiProperty()
    readonly isVerified: boolean;

    @ApiProperty()
    readonly isLiveStreamNow: boolean;

}