import { ApiProperty } from "@nestjs/swagger";
import { NewsItemResponse } from "./news.response";

export class NewsItemsResponse{
  
    constructor( object: any ){
        this.total = object.length;
        this.items = object.map( i => new NewsItemResponse(i) );
    }
   
    @ApiProperty()
    items: NewsItemResponse[];

    @ApiProperty()
    total: number;
}