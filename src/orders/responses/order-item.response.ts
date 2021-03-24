import { ApiProperty } from "@nestjs/swagger";
import { ProductItemResponse } from "src/products/responses/product.response";
import { UserResponse } from "src/users/responses/user.response";

export class OrderItemResponse{
  
    constructor( object: any ){
        this.id = object.id;
        this.product = new ProductItemResponse(object.product);
        this.user = new UserResponse(object.user);
        this.price = object.price;
        this.quantity = object.quantity;
        this.total = object.total;
        this.payment_method = object.payment_method;
        this.status = object.status;
        this.created_at = object.created_at;
    }

    @ApiProperty()
    id: String;

    @ApiProperty()
    user: any;

    @ApiProperty()
    product: any;

    @ApiProperty()
    price: Number;

    @ApiProperty()
    quantity: Number;

    @ApiProperty()
    total: Number;

    @ApiProperty()
    payment_method: String;

    @ApiProperty()
    status: String;

    @ApiProperty()
    created_at: Date;
}