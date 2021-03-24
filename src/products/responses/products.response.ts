import { ApiProperty } from "@nestjs/swagger";
import { ProductItemResponse } from "./product.response";

export class ProductItemsResponse{
  
    constructor( object: any ){
        this.total = object.length;
        this.items = object.map( i => new ProductItemResponse(i) );
    }
   
    @ApiProperty()
    items: ProductItemResponse[];

    @ApiProperty()
    total: Number;
}