import { ApiProperty } from "@nestjs/swagger";
import { VideosItemResponse } from "./videos.response";

export class VideosItemsPaginateResponse{
  
    constructor( object: any ){
        this.total = object.total.length > 0 ? object.total[0].count : 0;
        this.items = object.items.length > 0 ? object.items.map( i => new VideosItemResponse(i) ): [];

    }
   
    @ApiProperty()
    items: VideosItemResponse[];

    @ApiProperty()
    total: number;
}