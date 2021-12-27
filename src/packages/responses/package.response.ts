import { ApiProperty } from "@nestjs/swagger";

export class PackageItemResponse{
    constructor( object: any ){
        this.id = object.id ?? object._id;
        this.name = object.name;
        this.image = object.image;
        this.quantity = object.quantity ?? 0 ;
        this.price = object.price ?? 0;
        this.isBestSale = object.isBestSale;
    }
    @ApiProperty()
    id: string;

    @ApiProperty()
    image: string;

    @ApiProperty()
    quantity: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    price: Number;

    @ApiProperty()
    isBestSale: Boolean;
}