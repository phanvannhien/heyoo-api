import { ApiProperty } from "@nestjs/swagger";
import { UserProfileResponse } from "src/auth/responses/profile.response";
import { UserResponse } from "./user.response";

export class UsersProfileResponse{
    constructor( object: any ){
        this.total = object.total.length > 0 ? object.total[0].count : 0;
        this.items = object.items.length > 0 ? object.items.map( i => new UserProfileResponse(i) ): [];

    }
   
    @ApiProperty()
    items: UserResponse[];

    @ApiProperty()
    total: number;
}