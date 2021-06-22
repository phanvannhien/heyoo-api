import { ApiProperty } from "@nestjs/swagger";
import { LiveStreamItemResponse } from "src/livestreams/responses/live-item.response";

export class UserProfileResponse{
  
    constructor( object: any ){
        this.id         = object.id || object._id;
        this.fullname   = object.fullname;
        this.phone      = object.phone;
        this.email      = object.email;
        this.gender     = object.gender;
        this.avatar     = object.avatar || '';
        this.isVerified = object.isVerified;
        this.otp        = object.opt;
        this.otpCreatedAt = object.otpCreatedAt;
        this.bio = object.bio || '';
        this.dob = object.dob;
        this.country = object.country || 'VN';
        this.address = object.address || '';
        this.follower = object.follower || 0;
        this.following = object.following || 0;
        this.level = object.level ?? 0;
        this.isLiveStreamNow = object.isLiveStreamNow ?? false;
        this.livestream = object.livestream ? new LiveStreamItemResponse(object.livestream) : null ;

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

    @ApiProperty()
    readonly bio: string;

    @ApiProperty()
    readonly dob: string;

    @ApiProperty()
    readonly country: string;

    @ApiProperty()
    readonly address: string;

    @ApiProperty()
    readonly follower: number;

    @ApiProperty()
    readonly following: number;

    @ApiProperty()
    readonly isLiveStreamNow: boolean;

    @ApiProperty()
    readonly level: string;

    @ApiProperty()
    readonly livestream: object;
    
}