import { ApiProperty } from "@nestjs/swagger";
import { ProductItemResponse } from "src/products/responses/product.response";
import { UserResponse } from "src/users/responses/user.response";

export class OrderItemResponse{
  
    constructor( object: any ){
        this.id = object.id;
        this.product = object.product ? new ProductItemResponse(object.product) : null;
        this.user = object.user ? new UserResponse(object.user) : null;
        this.price = object.price;
        this.quantity = object.quantity;
        this.total = object.total;
        this.paymentMethod = object.paymentMethod;
        this.status = object.status;
        this.createdAt =  new Date(object.createdAt).getTime().toString();
    }

    @ApiProperty()
    id: string;

    @ApiProperty()
    user: any;

    @ApiProperty()
    product: any;

    @ApiProperty()
    price: number;

    @ApiProperty()
    quantity: number;

    @ApiProperty()
    total: number;

    @ApiProperty()
    paymentMethod: string;

    @ApiProperty()
    status: string;

    @ApiProperty()
    createdAt: string;
}