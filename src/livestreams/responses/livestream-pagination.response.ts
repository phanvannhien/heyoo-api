import { ApiProperty } from "@nestjs/swagger";
import { LiveStreamItemResponse } from "./live-item.response";


export class LiveStreamPaginationResponse{
  
    constructor( object: any ){
        this.total = object.total.length > 0 ? object.total[0].count : 0;
        this.items = object.items.length > 0 ? object.items.map( i => new LiveStreamItemResponse(i) ): [];
    }
   
    @ApiProperty()
    items: LiveStreamItemResponse[];

    @ApiProperty()
    total: number;
}