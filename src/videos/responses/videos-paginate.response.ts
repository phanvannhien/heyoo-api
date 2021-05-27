import { ApiProperty } from "@nestjs/swagger";
import { VideosItemResponse } from "./videos.response";

export class VideosItemsResponse{
  
    constructor( object: any ){
        this.total = object.length;
        this.items = object.map( i => new VideosItemResponse(i) );
    }
   
    @ApiProperty()
    items: VideosItemResponse[];

    @ApiProperty()
    total: number;
}