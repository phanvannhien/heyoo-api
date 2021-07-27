import { ApiProperty } from "@nestjs/swagger";
import { WalletItemResponse } from "./wallet.response";


export class WalletPaginateResponse{
  
    constructor( object: any ){
        this.total = object.total.length > 0 ? object.total[0].count : 0;
        this.items = object.items.length > 0 ? object.items.map( i => new WalletItemResponse(i) ): [];

    }
   
    @ApiProperty()
    items: WalletItemResponse[];

    @ApiProperty()
    total: number;
}