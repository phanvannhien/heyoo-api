import { ApiProperty } from "@nestjs/swagger";
import { UserResponse } from "./user.response";

export class UsersResponse{
    constructor( object: any ){
        this.total = object.total;
        this.items = object.items.map( i => new UserResponse(i) );
    }
   
    @ApiProperty()
    items: UserResponse[];

    @ApiProperty()
    total: number;
}