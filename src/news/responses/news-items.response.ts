import { ApiProperty } from "@nestjs/swagger";
import { NewsItemResponse } from "./news.response";

export class NewsListItemsResponse{
  
    constructor( object: any ){
        this.items = object.map( i => new NewsItemResponse(i) ) ;
    }
   
    @ApiProperty()
    items: NewsItemResponse[];

}