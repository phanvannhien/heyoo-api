import { ApiProperty } from "@nestjs/swagger";
import { ShopCategoriesResponse } from "src/shop-categories/responses/shop-categories.response";

export class ShopProductItemResponse{
  
    constructor( object: any ){
        this.id = object.id ?? object._id;
        this.productName = object.productName;
        this.thumbnail = object.thumbnail;
        this.images = object.images ?? '';
        this.price = object.price;
        this.category = object.category ? new ShopCategoriesResponse(object.category) :null;
        this.description = object.description;
        this.shop = object.shop;
        this.isPublished = object.isPublished;
    }
    @ApiProperty()
    id: string;

    @ApiProperty()
    thumbnail: string;

    @ApiProperty()
    images: string[];

    @ApiProperty()
    productName: string;

    @ApiProperty()
    price: Number;

    @ApiProperty()
    description: string;

    @ApiProperty()
    category: ShopCategoriesResponse;

    @ApiProperty()
    shop: string;

    @ApiProperty()
    isPublished: string;
}