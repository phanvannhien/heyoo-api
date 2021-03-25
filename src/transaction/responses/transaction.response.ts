import { ApiProperty } from "@nestjs/swagger";
import { UserResponse } from "src/users/responses/user.response";

export class TransactionItemResponse{
  
    constructor( object: any ){
        this.id = object.id;
        this.user = new UserResponse(object.user);
        this.rate = object.price;
        this.quantity = object.quantity;
        this.total = object.total;
        this.status = object.status;
        this.resource = object.resource;
        this.paymentMethod = object.paymentMethod;
        this.createdAt = object.createdAt;
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
    createdAt: Date;
}