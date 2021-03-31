import { ApiProperty } from "@nestjs/swagger";
import { FollowResponse } from "./follow.response";

export class FollowsResponse{
  
    constructor( object: any ){
        this.total = object.length;
        this.items = object.map( i => new FollowResponse(i) );
    }
   
    @ApiProperty()
    items: FollowResponse[];

    @ApiProperty()
    total: number;
}