import { ApiProperty } from "@nestjs/swagger";
import { ShopProductItemResponse } from "./shop-product.response";

export class ShopProductItemsResponse{
  
    constructor( object: any ){
        this.total = object.total;
        this.items = object.items.map( i => new ShopProductItemResponse(i) );
    }
   
    @ApiProperty()
    items: ShopProductItemResponse[];

    @ApiProperty()
    total: number;
}