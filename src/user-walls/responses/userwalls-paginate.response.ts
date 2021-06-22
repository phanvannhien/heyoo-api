import { ApiProperty } from "@nestjs/swagger";
import { UserWallsItemResponse } from "./userwalls.response";

export class UserWallsResponse{
  
    constructor( object: any ){
        this.total = object.length;
        this.items = object.map( i => new UserWallsItemResponse(i) );
    }
   
    @ApiProperty()
    items: UserWallsItemResponse[];

    @ApiProperty()
    total: number;
}