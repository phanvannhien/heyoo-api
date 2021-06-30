import { ApiProperty } from "@nestjs/swagger";
import { ShopVideoItemResponse } from "./shop-video-item.response";

export class ShopVideoResponse{
  
    constructor( object: any ){
        this.total = object.total.length > 0 ? object.total[0].count : 0;
        this.items = object.items.length > 0 ? object.items.map( i => new ShopVideoItemResponse(i) ): [];

    }
   
    @ApiProperty()
    items: ShopVideoItemResponse[];

    @ApiProperty()
    total: number;
}