import { ApiProperty } from "@nestjs/swagger";
import { WithDrawItemResponse } from "./withdraw.response";

export class WithDrawPaginateResponse{
    constructor( object: any ){
        this.total = object.total;
        this.items = object.items.map( i => new WithDrawItemResponse(i) );
    }
   
    @ApiProperty()
    items: WithDrawItemResponse[];

    @ApiProperty()
    total: number;
}