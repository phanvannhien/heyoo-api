import { ApiProperty } from "@nestjs/swagger";

export class CategoriesResponse{
  
    constructor( object: any ){
        this.id = object._id ?? object.id;
        this.categoryName = object.categoryName;
    }
    @ApiProperty()
    id: String;

    @ApiProperty()
    categoryName: String;
}