import { ApiProperty } from "@nestjs/swagger";
import { UserProfileResponse } from "src/auth/responses/profile.response";
import { UserResponse } from "./user.response";

export class UsersProfileResponse{
    constructor( object: any ){
        this.total = object.length;
        this.items = object.map( i => new UserProfileResponse(i) );
    }
   
    @ApiProperty()
    items: UserResponse[];

    @ApiProperty()
    total: number;
}