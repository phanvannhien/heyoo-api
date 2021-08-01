import { ApiProperty } from "@nestjs/swagger";
import { CategoriesResponse } from "src/categories/responses/categories.response";
import { UserResponse } from "src/users/responses/user.response";
import * as moment from 'moment';
import { ProductItemResponse } from "src/products/responses/product.response";


interface IDonateProduct{
    total: number,
    product: ProductItemResponse
}

export class DonateUserResponse{

    constructor( object: any ){
        this.total = object.total;
        this.items = object.items.map( i => {
            return {
                total: i.total,
                product: new ProductItemResponse( i.product )
            } as IDonateProduct
        });
        this.user = new UserResponse(object.user);
    }

    @ApiProperty()
    total: number;

    @ApiProperty()
    items: [IDonateProduct];

    @ApiProperty()
    user: UserResponse
}