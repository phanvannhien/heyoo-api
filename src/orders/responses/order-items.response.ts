import { ApiProperty } from "@nestjs/swagger";
import { OrderItemResponse } from "./order-item.response";


export class OrderItemsResponse{
  
    constructor( object: any ){
        this.total = object.length;
        this.items = object.map( i => new OrderItemResponse(i) );
    }
   
    @ApiProperty()
    items: OrderItemResponse[];

    @ApiProperty()
    total: number;
}