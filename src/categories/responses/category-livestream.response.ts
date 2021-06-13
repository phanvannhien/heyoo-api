import { ApiProperty } from "@nestjs/swagger";
import { LiveStreamItemResponse } from "src/livestreams/responses/live-item.response";

export class CategoryLiveStreamResponse{
  
    constructor( object: any ){
        this.page = object.page;
        this.items = object.items.map( i => new LiveStreamItemResponse(i) );
    }

    @ApiProperty()
    items: LiveStreamItemResponse[]

    @ApiProperty()
    page: number
}