import { ApiProperty } from "@nestjs/swagger";
import { ProductItemResponse } from "src/products/responses/product.response";
import { UserResponse } from "src/users/responses/user.response";

export class WalletItemResponse{
  
    constructor( object: any ){
        this.id = object.id;
        this.product = new ProductItemResponse(object.product);
        this.user = new UserResponse(object.user);
        this.toUser = new UserResponse(object.toUser);
        this.price = object.price;
        this.price = object.price;
        this.quantity = object.quantity;
        this.total = object.total;
        this.resource = object.resource;
        this.createdAt = object.createdAt;
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
    createdAt: Date;
}