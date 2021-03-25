import { ApiProperty } from "@nestjs/swagger";
import { WalletItemResponse } from "./wallet.response";


export class WalletItemsResponse{
  
    constructor( object: any ){
        this.total = object.length;
        this.items = object.map( i => new WalletItemResponse(i) );
    }
   
    @ApiProperty()
    items: WalletItemResponse[];

    @ApiProperty()
    total: number;
}