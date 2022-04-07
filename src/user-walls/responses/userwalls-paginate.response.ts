import { ApiProperty } from "@nestjs/swagger";
import { UserWallsItemResponse } from "./userwalls.response";

export class UserWallsResponse{
  
    constructor( object: any ){
        this.total = object.total.length > 0 ? object.total[0].count : 0;
        this.items = object.items.length > 0 ? object.items.map( i => new UserWallsItemResponse(i) ): [];
    }
   
    @ApiProperty()
    items: UserWallsItemResponse[];

    @ApiProperty()
    total: number;
}