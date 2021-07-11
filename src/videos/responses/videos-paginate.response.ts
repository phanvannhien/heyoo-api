import { ApiProperty } from "@nestjs/swagger";
import { VideosItemResponse } from "./videos.response";

export class VideosItemsResponse{
  
    constructor( object: any ){
        this.items = object.map( i => new VideosItemResponse(i) );
    }
   
    @ApiProperty()
    items: VideosItemResponse[];
}