import { ApiProperty } from "@nestjs/swagger";
import { UserResponse } from "src/users/responses/user.response";

export class PaymentItemResponse{
    constructor( object: any ){
        this.id = object.id ?? object._id;
        this.status = object.status;
        this.orderInfo = object.orderInfo;
        this.diamondQty = object.diamondQty ?? 0 ;
        this.price = object.price ?? 0;
        this.user = new UserResponse(object.user);
        this.createdAt =  new Date(object.createdAt).getTime().toString();
    }
    @ApiProperty()
    id: string;

    @ApiProperty()
    status: string;

    @ApiProperty()
    diamondQty: number;

    @ApiProperty()
    price: number;

    @ApiProperty()
    orderInfo: string;

    @ApiProperty()
    user: UserResponse;

    @ApiProperty()
    createdAt: string;
}