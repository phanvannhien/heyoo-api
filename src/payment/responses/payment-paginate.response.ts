import { ApiProperty } from "@nestjs/swagger";
import { PaymentItemResponse } from "./payment.response";

export class PaymentPaginateResponse{
    constructor( object: any ){
        this.total = object.total;
        this.items = object.items.map( i => new PaymentItemResponse(i) );
    }
   
    @ApiProperty()
    items: PaymentItemResponse[];

    @ApiProperty()
    total: number;
}