import { ApiProperty } from "@nestjs/swagger";
import { ProductItemResponse } from "src/products/responses/product.response";
import { UserResponse } from "src/users/responses/user.response";

export class WalletItemResponse{
  
    constructor( object: any ){
        this.id = object.id;
        this.product = object.product ? new ProductItemResponse(object.product) : null;
        this.user = object.user ? new UserResponse(object.user) : null;
        this.toUser = object.toUser ? new UserResponse(object.toUser) : null;
        this.price = object.price;
        this.price = object.price;
        this.quantity = object.quantity;
        this.total = object.total;
        this.resource = object.resource;
        this.createdAt =  new Date(object.createdAt).getTime().toString();
        this.liveStream = object.liveStream;
        this.donateUid = object.donateUid;
    }

    @ApiProperty()
    id: string;

    @ApiProperty()
    user: any;

    @ApiProperty()
    toUser: any;

    @ApiProperty()
    product: any;

    @ApiProperty()
    price: number;

    @ApiProperty()
    quantity: number;

    @ApiProperty()
    total: number;

    @ApiProperty()
    resource: string;

    @ApiProperty()
    createdAt: string;

    @ApiProperty()
    liveStream: string;

    @ApiProperty()
    donateUid: string;
}