import { ApiProperty } from "@nestjs/swagger";
import { UserResponse } from "src/users/responses/user.response";
import * as moment from 'moment';

export class TransactionItemResponse{
  
    constructor( object: any ){
        this.id = object.id;
        this.user = object.user ? new UserResponse(object.user) : null;
        this.rate = object.price;
        this.quantity = object.quantity;
        this.total = object.total;
        this.status = object.status;
        this.resource = object.resource;
        this.paymentMethod = object.paymentMethod;
        this.createdAt =  new Date(object.createdAt).getTime().toString();
        this.referenceId = object.referenceId;
        this.info = object.info;
    }

    @ApiProperty()
    id: string;

    @ApiProperty()
    user: any;

    @ApiProperty()
    rate: number;

    @ApiProperty()
    quantity: number;

    @ApiProperty()
    total: number;

    @ApiProperty()
    status: string;

    @ApiProperty()
    paymentMethod: string;

    @ApiProperty()
    resource: string;

    @ApiProperty()
    referenceId: string;

    @ApiProperty()
    info: string;

    @ApiProperty()
    createdAt: string;
}