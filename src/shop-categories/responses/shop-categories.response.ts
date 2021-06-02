import { ApiProperty } from "@nestjs/swagger";

export class ShopCategoriesResponse{
    constructor( object: any ){
        this.id = object.id;
        this.categoryName = object.categoryName;
    }
    @ApiProperty()
    id: String;

    @ApiProperty()
    categoryName: String;
}