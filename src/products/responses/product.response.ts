import { ApiProperty } from "@nestjs/swagger";

export class ProductItemResponse{
  
    constructor( object: any ){
        this.id = object.id;
        this.productName = object.productName;
        this.image = object.image;
        this.price = object.price;
    }
    @ApiProperty()
    id: String;

    @ApiProperty()
    image: String;

    @ApiProperty()
    productName: String;

    @ApiProperty()
    price: Number;
}