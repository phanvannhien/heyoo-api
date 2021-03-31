import { ApiProperty } from "@nestjs/swagger";
import { UserResponse } from "./user.response";

export class FollowResponse{
  
    constructor( object: any ){
        this.id         = object.id;
        this.user       = new UserResponse(object.user);
        this.follow     = new UserResponse(object.follow);
        this.createdAt  = object.createdAt;
    }
    @ApiProperty()
    readonly id: string;

    @ApiProperty()
    readonly user: UserResponse;

    @ApiProperty()
    readonly follow: UserResponse;

    @ApiProperty()
    readonly createdAt: Date;

}