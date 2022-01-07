import { ApiProperty } from "@nestjs/swagger";
import { TransactionItemResponse } from "./transaction.response";


export class TransactionItemsResponse{
  
    constructor( object: any ){
        this.total = object.total;
        this.items = object.items.map( i => new TransactionItemResponse(i) );
    }
   
    @ApiProperty()
    items: TransactionItemResponse[];

    @ApiProperty()
    total: number;
}