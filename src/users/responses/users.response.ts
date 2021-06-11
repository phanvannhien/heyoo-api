import { ApiProperty } from "@nestjs/swagger";
import { UserResponse } from "./user.response";

export class UsersResponse{
    constructor( object: any ){
        this.total = object.length;
        this.items = object.map( i => new UserResponse(i) );
    }
   
    @ApiProperty()
    items: UserResponse[];

    @ApiProperty()
    total: number;
}