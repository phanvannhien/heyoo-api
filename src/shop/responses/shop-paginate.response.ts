import { ApiProperty } from "@nestjs/swagger";
import { ShopItemResponse } from "./shop.response";

export class ShopsResponse{
  
    constructor( object: any ){
        this.total = object.length;
        this.items = object.map( i => new ShopItemResponse(i) );
    }
   
    @ApiProperty()
    items: ShopItemResponse[];

    @ApiProperty()
    total: number;
}