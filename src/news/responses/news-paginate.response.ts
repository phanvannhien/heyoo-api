import { ApiProperty } from "@nestjs/swagger";
import { NewsItemResponse } from "./news.response";

export class NewsItemsResponse{
  
    constructor( object: any ){
        this.total = object.total.length > 0 ? object.total[0].count : 0;
        this.items = object.items.length > 0 ? object.items.map( i => new NewsItemResponse(i) ): [];

    }
   
    @ApiProperty()
    items: NewsItemResponse[];

    @ApiProperty()
    total: number;
}