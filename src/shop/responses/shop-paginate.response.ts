import { ApiProperty } from "@nestjs/swagger";
import { ShopItemResponse } from "./shop.response";

export class ShopsResponse{
  
    constructor( object: any ){
        this.total = object.total.length > 0 ? object.total[0].count : 0;
        this.items = object.items.length > 0 ? object.items.map( i => new ShopItemResponse(i) ): [];


    }
   
    @ApiProperty()
    items: ShopItemResponse[];

    @ApiProperty()
    total: number;
}