import { ApiProperty } from "@nestjs/swagger";

export class ProductItemResponse{
  
    constructor( object: any ){
        this.id = object.id;
        this.productName = object.productName;
        this.image = object.image;
        this.imageAnimation = object.imageAnimation ?? '';
        this.price = object.price;
    }
    @ApiProperty()
    id: string;

    @ApiProperty()
    image: string;

    @ApiProperty()
    imageAnimation: string;

    @ApiProperty()
    productName: string;

    @ApiProperty()
    price: Number;
}